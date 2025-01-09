'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Loader2, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { uploadImages } from '../utils/uploadImages';

interface CreateHomestayFormProps {
  homestayId?: number;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  description: z.string().optional(),
  photos: z.array(z.instanceof(File)).optional(),
  location: z.object({
    lat: z.string().min(1, { message: 'Latitude is required' }),
    lng: z.string().min(1, { message: 'Longitude is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
  }),
  pricePerNight: z.string().min(1, { message: 'Price must be greater than zero' }),
  amenities: z.array(z.string()).optional(),
  availability: z.array(z.object({ date: z.string(), isAvailable: z.boolean() })).min(1, {
    message: 'Availability is required',
  }),
});

const CreateHomestayForm: React.FC<CreateHomestayFormProps> = ({ homestayId }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Manage upload state
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
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch homestay');
          }
          const data = await response.json();
          
          // Pre-fill the form
          form.reset({
            name: data.homestay.name,
            description: data.homestay.description,
            photos: [], // New photos array remains empty
            location: {
              lat: data.homestay.location.lat.toString(),
              lng: data.homestay.location.lng.toString(),
              address: data.homestay.location.address,
            },
            pricePerNight: data.homestay.pricePerNight.toString(),
            amenities: data.homestay.amenities || [],
            availability: data.homestay.availability.map((item: any) => ({
              date: item.date,
              isAvailable: item.isAvailable,
            })),
          });
  
          // // Store existing photo URLs for display
          // setPhotos(
          //   data.homestay.photos.map((photo: any) => ({
          //     id: photo.id,
          //     url: `/uploads/${photo.fileName}`,
          //   }))
          // );
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
  
    // Step 1: Create the HomestayDTO
    const homestayDTO = {
      id:homestayId,
      hostId: sessionStorage.getItem('hostId') || '',
      name: values.name,
      description: values.description || '',
      location: values.location,
      pricePerNight: values.pricePerNight,
      amenities: values.amenities,
      availability: values.availability,
    };
  
    // Step 2: Create FormData and append HomestayDTO as JSON
    const formData = new FormData();
    formData.append('homestay', JSON.stringify(homestayDTO));
  
    // Step 3: Upload photos as files (FileUploadDTO)
    if (values.photos && values.photos.length > 0) {
      values.photos.forEach((file) => {
        formData.append('files[]', file); // Append each file using 'files[]' key
      });
    }
  
    // Step 4: Make the API request to submit the form data
    try {
      const method = homestayId ? 'PUT' : 'POST';
      const response = await fetch(`/api/property`, {
        method,
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit homestay');
      }
  
      const responseData = await response.json();
      console.log('Homestay submitted successfully:', responseData);
     // Navigate to another page on success
    } catch (err) {
      setError('Failed to create or update homestay');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  
  

    
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
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
              {/* Photos */}
              <FormField
  control={form.control}
  name="photos"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Photos</FormLabel>
      <FormControl>
        <div className="space-y-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              form.setValue('photos', files);
            }}
          />
          {field.value?.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {field.value.map((file: File, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-md shadow"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-sm"
                    onClick={() => {
                      const updatedFiles = field.value.filter((_, i) => i !== index);
                      form.setValue('photos', updatedFiles);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
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
                        step="any"
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
                        step="any"
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
                        step="0.01"
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
                      <Controller
                        control={form.control}
                        name="availability"
                        render={({ field: controllerField }) => {
                          const selectedDates = controllerField.value.map((item) => new Date(item.date));

                          const handleSelect = (date: Date) => {
                            const formattedDate = format(date, 'yyyy-MM-dd');
                            // Check for duplicates
                            if (!controllerField.value.find((item) => item.date === formattedDate)) {
                              controllerField.onChange([
                                ...controllerField.value,
                                { date: formattedDate, isAvailable: true },
                              ]);
                            }
                          };

                          const handleRemove = (date: string) => {
                            const updatedAvailability = controllerField.value.filter(
                              (item) => item.date !== date
                            );
                            controllerField.onChange(updatedAvailability);
                          };

                          return (
                            <div className="space-y-2">
                              {/* Display Selected Dates */}
                              {controllerField.value.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {controllerField.value.map((item, index) => (
  <div
    key={index}
    className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
  >
    <span>{format(new Date(item.date), 'yyyy-MM-dd')}</span> {/* Ensure the date is properly formatted */}
    <button
      type="button"
      onClick={() => handleRemove(item.date)}
      className="text-red-500 hover:text-red-700"
    >
      &times;
    </button>
  </div>
))}

                                </div>
                              )}

                              {/* Popover Calendar for Selecting Dates */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                    {selectedDates.length > 0
                                      ? `${selectedDates.length} date(s) selected`
                                      : 'Pick Dates'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="multiple"
                                    selected={selectedDates}
                                    onSelect={(dates) => {
                                      if (Array.isArray(dates)) {
                                        dates.forEach((date) => handleSelect(date));
                                      } else if (dates) {
                                        handleSelect(dates);
                                      }
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
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
                  const updatedAmenities = field.value?.filter((a) => a !== amenity);
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value && !field.value.includes(value)) {
                  // Add the amenity to the array in the form state
                  form.setValue('amenities', [...field.value, value]);
                  e.currentTarget.value = ''; // Clear the input field after adding
                }
              }
            }}
            className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
        </div>
      </FormControl>
      <FormMessage className="text-xs font-normal text-red-500" />
    </FormItem>
  )}
/>


              {/* Submit Button */}
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
                  ) : homestayId ? (
                    'Update Homestay'
                  ) : (
                    'Create Homestay'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateHomestayForm;
