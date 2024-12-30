import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Use useRouter from Next.js

interface CreateHomestayFormProps {
  homestayId?: number;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  description: z.string().optional(),
  photos: z.array(z.string().url()).optional(),
  location: z.object({
    lat: z.string().min(-90).max(90, { message: 'Latitude must be between -90 and 90' }),
    lng: z.string().min(-180).max(180, { message: 'Longitude must be between -180 and 180' }),
    address: z.string().min(1, { message: 'Address is required' }),
  }),
  pricePerNight: z.string().min(1, { message: 'Price must be greater than zero' }),
  amenities: z.array(z.string()).optional(),
  availability: z.array(z.string()).min(1, { message: 'Availability is required' }),
});

const CreateHomestayForm: React.FC<CreateHomestayFormProps> = ({ homestayId }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      photos: [],
      location: { lat: '', lng: '', address: '' },
      pricePerNight: '',
      amenities: [],
      availability: [],
    },
  });

  useEffect(() => {
    if (homestayId) {
      async function fetchHomestayData() {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/property/stays?id=${homestayId}`);
          const data = await response.json();
          form.reset(data); 
        } catch (err) {
          setError('Error loading homestay data');
        } finally {
          setIsLoading(false);
        }
      }

      fetchHomestayData();
    }
  }, [homestayId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    const hostId = sessionStorage.getItem('hostId');
    if (!hostId) {
      setError('Host ID not found in session storage');
      setIsLoading(false);
      return;
    }

    const updatedValues = {
      id: homestayId,
      ...values,
      location: {
        lat: parseFloat(values.location.lat),
        lng: parseFloat(values.location.lng),
        address: values.location.address,
      },
      pricePerNight: parseFloat(values.pricePerNight),
    };

    try {
      const method = homestayId ? 'PUT' : 'POST';
      const url = homestayId ? `/api/property` : '/api/property';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedValues),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'An unexpected error occurred',
        }));
        throw new Error(errorData.error || 'Failed to submit homestay');
      }

      const data = await response.json();
      console.log('Homestay saved:', data);
      router.push('/homestays');
    } catch (err: any) {
      console.error('Error submitting homestay:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6 transform transition-all duration-500 ease-in-out hover:scale-105">
        {error && (
          <Alert variant="destructive" className="mb-4 animate-fade-in">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {homestayId ? 'Update Homestay' : 'Create Homestay'}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Homestay Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Homestay Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Homestay Name"
                      {...field}
                      className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal text-red-500" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Description"
                      {...field}
                      className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal text-red-500" />
                </FormItem>
              )}
            />

            {/* Location Inputs: Latitude, Longitude, Address */}
          
              {/* Latitude */}
              <FormField
                control={form.control}
                name="location.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Latitude"
                        {...field}
                        className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal text-red-500" />
                  </FormItem>
                )}
              />
              
              {/* Longitude */}
              <FormField
                control={form.control}
                name="location.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Longitude"
                        {...field}
                        className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal text-red-500" />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="location.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Address"
                        {...field}
                        className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal text-red-500" />
                  </FormItem>
                )}
              />
            

            {/* Price per Night */}
            <FormField
              control={form.control}
              name="pricePerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Price per Night</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price per Night"
                      {...field}
                      className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-normal text-red-500" />
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Availability</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value.map((date, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span>{date}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedDates = field.value.filter(d => d !== date);
                              form.setValue('availability', updatedDates);
                            }}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <Input
                        type="date"
                        onChange={(e) => {
                          const updatedDates = [...field.value, e.target.value];
                          form.setValue('availability', updatedDates);
                        }}
                        className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal text-red-500" />
                </FormItem>
              )}
            />

            {/* Amenities */}
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Amenities</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value?.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedAmenities = field.value?.filter(a => a !== amenity);
                              form.setValue('amenities', updatedAmenities);
                            }}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <Input
                        type="text"
                        placeholder="Add Amenity"
                        onChange={(e) => {
                          const updatedAmenities = [...field.value!, e.target.value];
                          form.setValue('amenities', updatedAmenities);
                        }}
                        className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-normal text-red-500" />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <Button
                className="w-full text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-md shadow-md py-2 px-4 transition-all duration-300"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  homestayId ? 'Update Homestay' : 'Create Homestay'
                )}
              </Button>
            </div>
          
         </div> </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateHomestayForm;
