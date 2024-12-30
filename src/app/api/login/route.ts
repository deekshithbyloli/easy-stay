import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Drizzle ORM instance
import { usersTable, hostsTable } from '../../../db/schema';
import { or, eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: 'Login and password are required' }, { status: 400 });
    }

    // Fetch the user by username or email
    const user = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.username, login), eq(usersTable.email, login)))
      .limit(1)
      .execute();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const foundUser = user[0];

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Fetch host details associated with the user ID
    const hostDetails = await db
      .select()
      .from(hostsTable)
      .where(eq(hostsTable.userId, foundUser.id))
      .execute();

    const hostId = hostDetails.length > 0 ? hostDetails[0].id : null;

    // Return successful response with authenticated user's details and host details
    return NextResponse.json(
      {
        userId: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
        hostId, // Send the hostId in the response
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
