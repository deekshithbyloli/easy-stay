import { createClient } from '../../../supabase/client';

interface HomestayLocation {
  id: number;
  name: string;
  lat: number;
  long: number;
  dist_meters: number;
}

export async function getHomestayLocation(lat: number, long: number): Promise<HomestayLocation[]> {
  const supabase = createClient();
  
  // Call the homestay_location function in Supabase to get homestay data
  const { data, error } = await supabase.rpc('homestay_location', {
    lat,
    long,
  });

  // Handle any errors
  if (error) {
    console.error('Error fetching homestay locations:', error.message);
    throw new Error('Failed to retrieve homestay locations');
  }

  // Return the data if no errors
  return data;
}
