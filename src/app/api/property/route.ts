import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Drizzle ORM instance
import { attachmentsTable, homestayAttachmentsTable, homestaysTable, hostsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { uploadImages } from '@/app/utils/uploadImages';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData(); // Parse multipart form data

    const homestayData = JSON.parse(data.get('homestay') as string); // Extract and parse homestay data
    const files = data.getAll('files[]') as File[]; // Extract all files as an array of File objects

    const { hostId, name, description, location, pricePerNight, amenities, availability } = homestayData;

    // Validate required fields
    if (!hostId || !name || !pricePerNight || !location || !availability) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Verify if the host exists
    const host = await db.select().from(hostsTable).where(eq(hostsTable.id, hostId)).limit(1).execute();
    if (!host || host.length === 0) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    // Upload images and store details in the attachments table
    const uploadedFiles = files.length > 0 ? await uploadImages(files) : [];
    const attachmentIds = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        console.log(`Processing file ${index + 1}/${uploadedFiles.length}:`, file);
        if (!file || !file.fileName || !file.fileType) {
          console.warn(`Skipping invalid file at index ${index}:`, file);
          return null;
        }

        try {
          // Insert the file into the attachments table and return its ID
          const result = await db
            .insert(attachmentsTable)
            .values({
              fileName: file.fileName,
              fileType: file.fileType,
            })
            .returning({ id: attachmentsTable.id });
          console.log(`Inserted attachment ID for file ${index + 1}:`, result[0].id);
          return result[0].id;
        } catch (err) {
          console.error(`Error inserting file ${index + 1}:`, err);
          return null;
        }
      })
    );

    // Filter out any null values from attachmentIds
    const validAttachmentIds = attachmentIds.filter((id) => id !== null);

    // Insert the homestay data into the database
    const [newHomestay] = await db
      .insert(homestaysTable)
      .values({
        hostId,
        name,
        description,
        location,
        pricePerNight,
        amenities: amenities || [],
        rating: 0, // Default rating
        availability,
      })
      .returning(); // Full return of inserted homestay data

    // Link attachments to the new homestay
    if (validAttachmentIds.length > 0) {
      await db.insert(homestayAttachmentsTable).values(
        validAttachmentIds.map((attachmentId) => ({
          homestayId: newHomestay.id,
          attachmentId,
        }))
      );
    }

    return NextResponse.json(
      {
        message: 'Homestay added successfully',
        homestay: newHomestay,
        attachmentIds: validAttachmentIds,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error adding homestay:', err);
    return NextResponse.json({ error: 'Failed to add homestay' }, { status: 500 });
  }
}







export async function GET(req: NextRequest) {
  try {
    // Accessing query parameter for the new app directory routing
    const hostId = req.nextUrl.searchParams.get('hostId');  // Correctly fetch 'hostId' from query parameters
    
    console.log('Received hostId:', hostId);

    if (!hostId) {
      console.error('Host ID is missing in the request.');
      return NextResponse.json({ error: 'Host ID is required' }, { status: 400 });
    }

    // Ensure hostId is a valid number
    const parsedHostId = Number(hostId);
    if (isNaN(parsedHostId)) {
      console.error(`Invalid hostId provided: ${hostId}`);
      return NextResponse.json({ error: 'Invalid host ID' }, { status: 400 });
    }

    // Query the homestays based on the provided hostId
    console.log(`Querying homestays for hostId: ${parsedHostId}`);
    const homestays = await db
      .select()
      .from(homestaysTable)
      .where(eq(homestaysTable.hostId, parsedHostId))
      .execute();

    if (homestays.length === 0) {
      console.log(`No homestays found for hostId: ${parsedHostId}`);
      return NextResponse.json({ message: 'No homestays found for this host' }, { status: 404 });
    }

    // Return the homestay details
    console.log(`Found ${homestays.length} homestays for hostId: ${parsedHostId}`);
    return NextResponse.json(homestays, { status: 200 });

  } catch (err) {
    // Log the error details with more context
    console.error('Error retrieving homestays:', err);

    return NextResponse.json({ error: 'Failed to retrieve homestay details' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.formData(); // Parse multipart form data

    const homestayData = JSON.parse(data.get('homestay') as string); // Extract and parse homestay data
    const files = data.getAll('files[]') as File[]; // Extract all files as an array of File objects

    const { id, hostId, name, description, location, pricePerNight, amenities, availability } = homestayData;

    // Validate required fields
    if (!id || !hostId || !name || !pricePerNight || !location || !availability) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Verify if the homestay exists
    const existingHomestay = await db.select().from(homestaysTable).where(eq(homestaysTable.id, id)).limit(1).execute();
    if (!existingHomestay || existingHomestay.length === 0) {
      return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
    }

    // Verify if the host exists
    const host = await db.select().from(hostsTable).where(eq(hostsTable.id, hostId)).limit(1).execute();
    if (!host || host.length === 0) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    // Upload new images and store details in the attachments table
    const uploadedFiles = files.length > 0 ? await uploadImages(files) : [];
    const attachmentIds = await Promise.all(
      uploadedFiles.map(async (file, index) => {
        console.log(`Processing file ${index + 1}/${uploadedFiles.length}:`, file);
        if (!file || !file.fileName || !file.fileType) {
          console.warn(`Skipping invalid file at index ${index}:`, file);
          return null;
        }

        try {
          // Insert the file into the attachments table and return its ID
          const result = await db
            .insert(attachmentsTable)
            .values({
              fileName: file.fileName,
              fileType: file.fileType,
            })
            .returning({ id: attachmentsTable.id });
          console.log(`Inserted attachment ID for file ${index + 1}:`, result[0].id);
          return result[0].id;
        } catch (err) {
          console.error(`Error inserting file ${index + 1}:`, err);
          return null;
        }
      })
    );

    // Filter out any null values from attachmentIds
    const validAttachmentIds = attachmentIds.filter((id) => id !== null);

    // Update the homestay data in the database
    await db
      .update(homestaysTable)
      .set({
        hostId,
        name,
        description,
        location,
        pricePerNight,
        amenities: amenities || [],
        availability,
      })
      .where(eq(homestaysTable.id, id));

    // Link new attachments to the homestay
    if (validAttachmentIds.length > 0) {
      await db.insert(homestayAttachmentsTable).values(
        validAttachmentIds.map((attachmentId) => ({
          homestayId: id,
          attachmentId,
        }))
      );
    }

    return NextResponse.json(
      {
        message: 'Homestay updated successfully',
        homestayId: id,
        attachmentIds: validAttachmentIds,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating homestay:', err);
    return NextResponse.json({ error: 'Failed to update homestay' }, { status: 500 });
  }
}


  export async function DELETE(req: NextRequest) {
    try {
      // Fetch homestay ID from query params
      const homestayId = req.nextUrl.searchParams.get('id');
      console.log('Received homestay ID:', homestayId); // Log the homestay ID
    
      if (!homestayId) {
        console.error('No homestay ID provided');
        return NextResponse.json({ error: 'Homestay ID is required' }, { status: 400 });
      }
    
      const parsedHomestayId = Number(homestayId);
      if (isNaN(parsedHomestayId)) {
        console.error('Invalid homestay ID:', homestayId);
        return NextResponse.json({ error: 'Invalid homestay ID' }, { status: 400 });
      }
    
      // Find the homestay to ensure it exists
      const homestay = await db
        .select()
        .from(homestaysTable)
        .where(eq(homestaysTable.id, parsedHomestayId))
        .limit(1)
        .execute();
    
      console.log('Homestay found:', homestay); // Log the fetched homestay data
    
      if (!homestay || homestay.length === 0) {
        console.error(`Homestay with ID ${parsedHomestayId} not found`);
        return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
      }
    
      // Attempt to delete the homestay using Drizzle ORM's delete syntax
      const result = await db
        .delete(homestaysTable)
        .where(eq(homestaysTable.id, parsedHomestayId))
        .execute();
    
      console.log('Deletion result:', result); // Log the result of deletion attempt
    
      if (result) {
        console.log('Homestay deleted successfully');
        return NextResponse.json({ message: 'Homestay deleted successfully' }, { status: 200 });
      } else {
        console.error('Deletion failed, no rows affected');
        return NextResponse.json({ error: 'Failed to delete homestay' }, { status: 500 });
      }
    
    } catch (err) {
      console.error('Error deleting homestay:', err);
      return NextResponse.json({ error: 'Failed to delete homestay' }, { status: 500 });
    }
  }
  
  

  










  
  
  