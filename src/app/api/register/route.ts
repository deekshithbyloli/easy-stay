import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Drizzle ORM instance
import { usersTable, hostsTable } from '../../../db/schema';
import { or, eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, name, role } = await req.json();

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

    // Insert the new user into the database
    const [newUser] = await db
      .insert(usersTable)
      .values({
        username,
        email,
        password: hashedPassword,
        name,
        role: userRole, // Use the provided role or default to 'user'
      })
      .returning();

    if (userRole === 'host') {
      // Insert into hostsTable if the user is a host
      await db
        .insert(hostsTable)
        .values({
          userId: newUser.id, // Use the ID of the newly created user
          propertyIds: [], // Default empty array for property IDs
        })
        .execute();
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
