import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { db } from '@/db'; // Drizzle ORM instance
import { usersTable } from '@/db/schema';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract parameters from the confirmation URL
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/'; // Default redirect path

  if (tokenHash && type) {
    const supabase = await createClient();

    try {
      // Verify the OTP with Supabase
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash
      });

      if (error) {
        console.error('OTP verification failed:', error.message);
        redirect('/error'); // Redirect to an error page if verification fails
        return;
      }

      console.log('Email verification successful.');

      // Retrieve user details after successful OTP verification
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error('Failed to fetch user after verification:', userError?.message);
        redirect('/error'); // Redirect to an error page if user retrieval fails
        return;
      }

      const { email } = userData.user;

      // Update the user's database record (if necessary)
      const userInDb = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .execute();

      if (userInDb.length === 0) {
        console.error('User not found in database.');
        redirect('/error'); // Redirect to an error page if the user is not found
        return;
      }

      // Optionally, update user status in the database
      await db
        .update(usersTable)
        .set({ is_verified: true }) // Example: Set an `is_verified` field
        .where(eq(usersTable.email, email))
        .execute();

      console.log('User email verification status updated in database.');

      // Redirect the user to the specified "next" URL or the app root
      redirect(next);
    } catch (err) {
      console.error('Unexpected error during email verification:', err);
      redirect('/error'); // Redirect to an error page if an unexpected error occurs
    }
  } else {
    // Redirect to an error page if required parameters are missing
    redirect('/error');
  }
}
