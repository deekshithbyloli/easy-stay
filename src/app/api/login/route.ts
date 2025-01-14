import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Drizzle ORM instance
import { usersTable, hostsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { login, password } = await req.json();

    if (!login || !password) {
      return NextResponse.json({ error: 'Login and password are required' }, { status: 400 });
    }

    // Use Supabase's signInWithPassword method for authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: login, // Assuming login is an email, adapt if needed
      password
    });

    if (authError || !authData.user) {
      console.error('Supabase login error:', authError?.message);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Fetch the user from the database
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, login)) // Adjust to match your schema
      .limit(1)
      .execute();

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const foundUser = user[0];

    // Fetch host details associated with the user ID
    const hostDetails = await db
      .select()
      .from(hostsTable)
      .where(eq(hostsTable.userId, foundUser.id))
      .execute();

    const hostId = hostDetails.length > 0 ? hostDetails[0].id : null;

    // Return successful response with user details and host information
    return NextResponse.json(
      {
        userId: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
        hostId // Include hostId if the user is a host
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
