import { getHomestayLocation } from '@/app/utils/getGeoLocation';
import { NextRequest, NextResponse } from 'next/server';


// Define the structure of HomestayLocation for type safety
interface HomestayLocation {
  id: number;
  name: string;
  lat: number;
  long: number;
  dist_meters: number;
}

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get('lat');
    const long = req.nextUrl.searchParams.get('long');

    if (!lat || !long) {
      return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const parsedLat = parseFloat(lat);
    const parsedLong = parseFloat(long);

    if (isNaN(parsedLat) || isNaN(parsedLong)) {
      return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
    }

    // Fetch homestay locations from Supabase using the custom function
    const homestays: HomestayLocation[] = await getHomestayLocation(parsedLat, parsedLong);

    if (homestays.length === 0) {
      return NextResponse.json({ error: 'No homestays found within the specified radius' }, { status: 404 });
    }

    // Prepare homestay data for map rendering (returning relevant map data)
    const mapData = homestays.map((homestay) => ({
      id: homestay.id,
      name: homestay.name,
      lat: homestay.lat,
      long: homestay.long,
      dist_meters: homestay.dist_meters,
    }));

    // Return the homestay data
    return NextResponse.json(mapData, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch homestay locations' }, { status: 500 });
  }
}
