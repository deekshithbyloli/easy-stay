'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/modals/modals';
import CreateHomestayForm from '@/app/forms/PropertyForm';
import { FaMapMarkerAlt, FaDollarSign, FaEdit, FaTrash } from 'react-icons/fa';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner border-t-4 border-indigo-500 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold text-center mb-12 text-gray-800">Homestay Listings</h1>
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg transition-colors duration-300"
        >
          Create New Property
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homestays.map((homestay) => (
          <Card key={homestay.id} className="w-full shadow-xl rounded-lg overflow-hidden bg-white">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 flex transition-transform duration-700" style={{ animation: 'slide 10s infinite' }}>
                {homestay.attachmentIds.map((attachmentId: string, index: number) => (
                  <img
                    key={index}
                    src={`/api/attachments?attachmentId=${attachmentId}`}
                    alt={homestay.name}
                    className="w-full h-full object-cover"
                  />
                ))}
              </div>
            </div>
            <CardHeader className="bg-gray-800 p-4 text-white">
              <CardTitle className="text-lg">{homestay.name}</CardTitle>
              <CardDescription className="flex items-center text-sm mt-1">
                <FaMapMarkerAlt className="mr-2" /> {homestay.location.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">{homestay.description}</p>
              <p className="mt-2 flex items-center text-gray-900">
                <FaDollarSign className="mr-1" /> {homestay.pricePerNight} per Night
              </p>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => {
                  setEditingHomestay(homestay);
                  setIsEditModalOpen(true);
                }}
              >
                <FaEdit className="mr-1" /> Edit
              </Button>
              <Button variant="destructive" className="flex items-center">
                <FaTrash className="mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal
        title="Create New Property"
        description="Fill out the details to create a new property."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        modalSize="max-w-lg"
      >
        <CreateHomestayForm />
      </Modal>

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
