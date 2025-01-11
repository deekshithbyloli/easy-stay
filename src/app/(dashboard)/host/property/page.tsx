'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CreateHomestayForm from '@/app/forms/PropertyForm';
import { Modal } from '@/components/modals/modals';

const HomestayDisplay = () => {
  const [homestays, setHomestays] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState<any | null>(null);

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
    try {
      setLoading(true);
      const response = await fetch(`/api/property?id=${homestayId}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok) {
        setHomestays(homestays.filter((homestay) => homestay.id !== homestayId));
        console.log('Homestay deleted:', result.message);
      } else {
        throw new Error(result.error || 'Failed to delete homestay');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold text-center mb-12 text-gray-800">Homestay Details</h1>
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Create New Property
        </Button>
      </div>

      {homestays.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No homestays found for this host.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {homestays.map((homestay) => (
            <Card key={homestay.id} className="w-full shadow-xl rounded-lg overflow-hidden bg-white">
              <CardHeader className="bg-gray-800 p-4 text-white">
                <CardTitle>{homestay.name}</CardTitle>
                <CardDescription>{homestay.location.address}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p>{homestay.description}</p>
                <p>Price per Night: ${homestay.pricePerNight}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingHomestay(homestay);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteHomestay(homestay.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for creating a new property */}
      <Modal
        title="Create New Property"
        description="Fill out the details to create a new property."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        modalSize="max-w-lg"
      >
        <CreateHomestayForm />
      </Modal>

      {/* Modal for editing a property */}
      <Modal
        title="Edit Property"
        description="Modify the details of the property."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        modalSize="max-w-lg"
      >
        <CreateHomestayForm homestayId={editingHomestay?.id} />
      </Modal>
    </div>
  );
};

export default HomestayDisplay;
