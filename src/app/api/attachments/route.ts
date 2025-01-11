import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Drizzle ORM instance
import { attachmentsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '../../../../supabase/client';

export async function GET(req: NextRequest) {
  try {
    // Fetch attachment ID from query params
    const attachmentId = req.nextUrl.searchParams.get('attachmentId');
    console.log('Received attachment ID:', attachmentId); // Log the attachment ID

    if (!attachmentId) {
      console.error('No attachment ID provided');
      return NextResponse.json({ error: 'Attachment ID is required' }, { status: 400 });
    }

    const parsedAttachmentId = Number(attachmentId);
    if (isNaN(parsedAttachmentId)) {
      console.error('Invalid attachment ID:', attachmentId);
      return NextResponse.json({ error: 'Invalid attachment ID' }, { status: 400 });
    }

    // Query the attachment record from the database
    const [attachment] = await db
      .select()
      .from(attachmentsTable)
      .where(eq(attachmentsTable.id, parsedAttachmentId))
      .limit(1)
      .execute();

    console.log('Attachment found:', attachment); // Log the fetched attachment data

    if (!attachment) {
      console.error(`Attachment with ID ${parsedAttachmentId} not found`);
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    const { fileName, fileType } = attachment;

    // Create a Supabase client instance
    const supabase = createClient();

    // Download the file from the storage bucket
    const { data: fileData, error: fileError } = await supabase.storage
      .from('property-image')
      .download(fileName);

    if (fileError || !fileData) {
      console.error(
        'Failed to download file:',
        fileError?.message || 'Unknown error'
      );
      return NextResponse.json(
        { error: 'Failed to download file' },
        { status: 500 }
      );
    }

    console.log('File downloaded successfully:', fileName);

    // Return the file data as a binary response
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': fileType,
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error('Error retrieving attachment:', err);
    return NextResponse.json({ error: 'Failed to retrieve attachment' }, { status: 500 });
  }
}
