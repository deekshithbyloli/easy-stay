'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modals/modals';
import CreateHomestayForm from '@/app/forms/PropertyForm';
import { FaMapMarkerAlt, FaDollarSign, FaEdit, FaTrash } from 'react-icons/fa';

const HomestayDisplay = () => {
  const [homestays, setHomestays] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState<unknown | null>(null);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomestays();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="loader w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Manage Your Homestays hii
        </h1>
        <p className="text-lg text-gray-600">Add, edit, and manage your properties seamlessly.</p>
      </header>

      <div className="flex justify-between items-center">
        <p className="text-gray-700 text-sm">Showing {homestays.length} properties</p>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Property
        </Button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {homestays.map((homestay) => (
          <div
            key={homestay.id}
            className="group relative bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:-translate-y-1"
          >
            <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center animate-slide group-hover:scale-105 transition-transform duration-700">
                {homestay.attachmentIds.length > 0 ? (
                  homestay.attachmentIds.map((attachmentId: string, index: number) => (
                    <img
                      key={index}
                      src={`/api/attachments?attachmentId=${attachmentId}`}
                      alt={homestay.name}
                      className={`w-full h-full object-cover ${index > 0 ? 'hidden group-hover:block' : ''}`}
                    />
                  ))
                ) : (
                  <div className="text-gray-500">No Images Available</div>
                )}
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{homestay.name}</h2>
              <p className="text-sm text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-1 text-gray-400" /> {homestay.location.address}
              </p>
              <p className="text-md text-gray-700 font-medium flex items-center">
                <FaDollarSign className="mr-1 text-green-500" /> {homestay.pricePerNight} / night
              </p>
            </div>

            <div className="absolute top-2 right-2 space-x-2">
              <Button
                onClick={() => {
                  setEditingHomestay(homestay);
                  setIsEditModalOpen(true);
                }}
                className="bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200"
              >
                <FaEdit className="text-blue-500" />
              </Button>
              <Button className="bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200">
                <FaTrash className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Create New Property"
        description="Fill out the details to create a new property."
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      >
        <CreateHomestayForm />
      </Modal>

      <Modal
        title="Edit Property"
        description="Modify the details of the property."
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <CreateHomestayForm homestayId={editingHomestay?.id} />
      </Modal>
    </div>
  );
};

export default HomestayDisplay;
