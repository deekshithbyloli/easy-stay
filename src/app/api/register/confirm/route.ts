import { NextRequest, NextResponse } from 'next/server';

import { or, eq } from 'drizzle-orm';
import bcrypt from 'bcrypt'; // For password hashing
import { createClient } from '@/app/utils/supabase/server';
import { db } from '@/db';
import { hostsTable, usersTable } from '@/db/schema';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  try {
    const { username, email, password, name, role } = await req.json();

    // Validate request payload
    if (!username || !email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if the username or email already exists in the database
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.username, username), eq(usersTable.email, email)))
      .limit(1)
      .execute();

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }

    // Validate role
    const validRoles = ['user', 'admin', 'host'];
    const userRole = validRoles.includes(role) ? role : 'user'; // Default to 'user' if invalid role

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sign up the user with Supabase
    const { user, error } = await supabase.auth.signUp({
      email,
      password // Supabase requires the plain password for its authentication
    });
    console.log(user);

    if (error) {
      console.error('Supabase sign-up error:', error.message);
      return NextResponse.json(
        { error: 'Failed to create user. Please try again.' },
        { status: 500 }
      );
    }

    // Save the user information in the database
    const [newUser] = await db
      .insert(usersTable)
      .values({
        username,
        email,
        password: hashedPassword,
        name,
        role: userRole
      })
      .returning();

    console.log('User saved in the database:', newUser);

    // If the user role is 'host', add them to the hosts table
    if (userRole === 'host') {
      const [newHost] = await db
        .insert(hostsTable)
        .values({
          userId: newUser.id,
          propertyIds: [] // Initialize with an empty array
        })
        .returning();

      console.log('Host added to hosts table:', newHost);
    }

    // Return success response
    return NextResponse.json(
      {
        message: 'User registered successfully. Please check your email to confirm your account.',
        user: newUser
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
