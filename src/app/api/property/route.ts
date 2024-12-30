import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db'; // Drizzle ORM instance
import { homestaysTable, hostsTable } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { hostId, name, description, photos, location, pricePerNight, amenities, availability } = await req.json();

    if (!hostId || !name || !pricePerNight || !location || !availability) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Check if the host exists
    const host = await db
      .select()
      .from(hostsTable)
      .where(eq(hostsTable.id, hostId))
      .limit(1)
      .execute();

    if (!host || host.length === 0) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 });
    }

    // Insert the new homestay into the database
    const [newHomestay] = await db
      .insert(homestaysTable)
      .values({
        hostId,
        name,
        description,
        photos: photos || [],
        location,
        pricePerNight,
        amenities: amenities || [],
        rating: 0, 
        availability,
      })
      .returning();

    return NextResponse.json({ message: 'Homestay added successfully', homestay: newHomestay }, { status: 201 });
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
      const { id, name, description, photos, location, pricePerNight, amenities, availability } = await req.json();
  
      if (!id || !name || !pricePerNight || !location || !availability) {
        return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
      }
  
      // Find the homestay by ID
      const homestay = await db
        .select()
        .from(homestaysTable)
        .where(eq(homestaysTable.id, id))
        .limit(1)
        .execute();
  
      if (!homestay || homestay.length === 0) {
        return NextResponse.json({ error: 'Homestay not found' }, { status: 404 });
      }
  
      // Update the homestay
      const [updatedHomestay] = await db
        .update(homestaysTable)
        .set({
          name,
          description: description || homestay[0].description,
          photos: photos || homestay[0].photos,
          location: location || homestay[0].location,
          pricePerNight,
          amenities: amenities || homestay[0].amenities,
          availability,
        })
        .where(eq(homestaysTable.id, id))
        .returning();
  
      return NextResponse.json({ message: 'Homestay updated successfully', homestay: updatedHomestay }, { status: 200 });
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
  
  

  










  
  
  