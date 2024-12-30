'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog'; // Modal components
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden for accessibility
import CreateHomestayForm from '@/app/forms/PropertyForm';

const HomestayDisplay = () => {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState<any | null>(null);

  const [newHomestay, setNewHomestay] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    location: { address: '', lat: '', lng: '' },
    amenities: '',
    photos: '',
  });

  useEffect(() => {
    const storedHostId = sessionStorage.getItem('hostId');

    if (!storedHostId) {
      setError('Host ID not found in session storage');
      setLoading(false);
      return;
    }

    const fetchHomestays = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/property?hostId=${storedHostId}`);
        const data = await response.json();

        if (response.ok) {
          setHomestays(data);
        } else {
          setError(data.message || 'Failed to load homestays');
        }
      } catch (err) {
        setError('An error occurred while fetching homestays.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, []);

  const handleDeleteHomestay = async (homestayId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/property?id=${homestayId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete homestay');
      }

      setHomestays(homestays.filter((homestay) => homestay.id !== homestayId));

      console.log('Homestay deleted:', result.message);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error deleting homestay:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold text-center mb-12 text-gray-800">Homestay Details</h1>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg transition-colors duration-300">
          Create New Property
        </Button>
      </div>

      {homestays.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No homestays found for this host.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {homestays.map((homestay) => (
            <Card key={homestay.id} className="w-full shadow-xl rounded-lg overflow-hidden bg-white transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
              <CardHeader className="bg-gray-800 p-4 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-semibold">{homestay.name}</CardTitle>
                <CardDescription className="mt-2">{homestay.location.address}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-lg text-gray-800">{homestay.description}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Price per Night:</strong> ${homestay.pricePerNight}</p>
                  <p><strong>Amenities:</strong> {homestay.amenities.join(', ')}</p>
                  <p><strong>Rating:</strong> {homestay.rating} / 5</p>
                </div>
                {homestay.photos.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto">
                    {homestay.photos.slice(0, 3).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Homestay Photo ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No photos available</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between p-4 bg-gray-100 rounded-b-lg">
                <Button
                  variant="outline"
                  className="text-indigo-600 hover:bg-indigo-50"
                  onClick={() => { setEditingHomestay(homestay); setIsEditModalOpen(true); }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteHomestay(homestay.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for creating a new homestay */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-out">
          <DialogHeader className="bg-indigo-600 text-white p-4 rounded-t-lg">
            <VisuallyHidden>
              <DialogTitle>Create New Property</DialogTitle>
            </VisuallyHidden>
            <h2 className="text-2xl font-semibold">Create New Property</h2>
          </DialogHeader>
          <CreateHomestayForm />
        </DialogContent>
      </Dialog>

      {/* Modal for editing an existing homestay */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg p-8 bg-white rounded-lg shadow-xl transform transition-all duration-300 ease-out">
          <DialogHeader className="bg-yellow-600 text-white p-4 rounded-t-lg">
            <VisuallyHidden>
              <DialogTitle>Edit Property</DialogTitle>
            </VisuallyHidden>
            <h2 className="text-2xl font-semibold">Edit Property</h2>
          </DialogHeader>
          <CreateHomestayForm homestayId={editingHomestay?.id} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomestayDisplay;
