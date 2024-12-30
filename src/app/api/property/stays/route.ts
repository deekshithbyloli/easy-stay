import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { homestaysTable } from '@/db/schema';
import { db } from '@/db';

export async function GET(req: NextRequest) {
  try {
    const homestayId = req.nextUrl.searchParams.get('id'); // Fetch homestay ID from query params

    if (!homestayId) {
      return NextResponse.json({ error: 'Homestay ID is required' }, { status: 400 });
    }

    const parsedHomestayId = Number(homestayId);
    if (isNaN(parsedHomestayId)) {
      return NextResponse.json({ error: 'Invalid homestay ID' }, { status: 400 });
    }

    // Query the homestay by its ID
    const homestay = await db
      .select()
      .from(homestaysTable)
      .where(eq(homestaysTable.id, parsedHomestayId))
      .limit(1)
      .execute();

    if (!homestay || homestay.length === 0) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
    }

    return NextResponse.json(homestay[0], { status: 200 });
  } catch (err) {
    console.error('Error retrieving homestay details:', err);
    return NextResponse.json({ error: 'Failed to retrieve homestay details' }, { status: 500 });
  }
}
