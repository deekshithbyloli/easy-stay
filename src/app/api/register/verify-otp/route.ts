import { NextRequest, NextResponse } from 'next/server';
import { hostsTable, usersTable } from '@/db/schema';
import { db } from '@/db';
import bcrypt from 'bcrypt';
import { supabase } from '@/app/utils/client';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, username, password, name, role } = await req.json();

    if (!email || !otp || !username || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Step 2: Verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });
    console.log(data);

    if (error) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

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
        role: role === 'host' ? 'host' : 'user' // Default role to 'user'
      })
      .returning();

    if (role === 'host') {
      // Insert into hostsTable if the user is a host
      await db
        .insert(hostsTable)
        .values({
          userId: newUser.id, // Use the ID of the newly created user
          propertyIds: [] // Default empty array for property IDs
        })
        .execute();
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json({ error: 'Failed to verify OTP or register user' }, { status: 500 });
  }
}
