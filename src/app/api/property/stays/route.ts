import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { attachmentsTable, homestayAttachmentsTable, homestaysTable } from '@/db/schema';
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

    const homestayData = homestay[0];

    // Query the attached photos (attachments)
    const attachments = await db
      .select()
      .from(homestayAttachmentsTable)
      .where(eq(homestayAttachmentsTable.homestayId, parsedHomestayId))
      .innerJoin(attachmentsTable, eq(homestayAttachmentsTable.attachmentId, attachmentsTable.id))
      .execute();

    // Extract photo details properly
    const photos = attachments.map((attachment) => ({
      id: attachment.attachments_table.id,
      fileName: attachment.attachments_table.fileName,
      fileType: attachment.attachments_table.fileType,
    }));

    const photoIds = photos.map((photo) => photo.id);

    console.log('Parsed homestay ID:', parsedHomestayId);
    console.log('Retrieved homestay data:', homestayData);
    console.log('Attachments query result:', attachments);
    console.log('Extracted photo IDs:', photoIds);
    console.log('Extracted photo details:', photos);

    return NextResponse.json(
      {
        homestay: {
          ...homestayData,
          photos,
        },
        photoIds,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error retrieving homestay details:', err);
    return NextResponse.json({ error: 'Failed to retrieve homestay details' }, { status: 500 });
  }
}



