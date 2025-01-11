'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { Button } from '@/components/ui/button'; // Assuming custom button component
import { Card } from '@/components/ui/card'; // Assuming custom card component
import { Table } from '@/components/ui/table'; // Assuming custom table component
import { CalendarIcon, HomeIcon, UsersIcon } from 'lucide-react'; // Assuming these icons are available

export default function HostDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  // Placeholder data for bookings
  const bookings = [
    { id: 1, guest: 'John Doe', checkIn: '2024-01-01', checkOut: '2024-01-05', status: 'Pending' },
    { id: 2, guest: 'Jane Smith', checkIn: '2024-01-15', checkOut: '2024-01-18', status: 'Confirmed' },
  ];

  const handleApproveBooking = (id: number) => {
    console.log('Approve booking', id);
  };

  const handleCancelBooking = (id: number) => {
    console.log('Cancel booking', id);
  };

  const handlePropertyManagementRedirect = () => {
    router.push('/host/property'); // Redirect to the property management page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center">Host Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Property Management */}
          <Card className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <HomeIcon className="h-8 w-8 text-teal-500 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Property Management</h2>
            </div>
            <p className="text-gray-600 mb-6">Manage your homestay details, pricing, and availability.</p>
            <Button
              className="w-full text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-all"
              onClick={handlePropertyManagementRedirect} // Add the onClick handler
            >
              Manage Property
            </Button>
          </Card>

          {/* Chat with Guests */}
          <Card className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <UsersIcon className="h-8 w-8 text-indigo-500 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Chat with Guests</h2>
            </div>
            <p className="text-gray-600 mb-6">Communicate with your guests for inquiries or special requests.</p>
            <Button className="w-full text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all">
              Open Chat
            </Button>
          </Card>

          {/* Food Menu Management */}
          <Card className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-8 w-8 text-yellow-500 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Food Menu Management</h2>
            </div>
            <p className="text-gray-600 mb-6">Manage menu items, pricing, and food packages.</p>
            <Button className="w-full text-white bg-yellow-600 hover:bg-yellow-700 rounded-md transition-all">
              Manage Menu
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
          {/* Booking Management */}
          <Card className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <UsersIcon className="h-8 w-8 text-gray-600 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>
            </div>
            <Table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 text-left text-sm font-medium text-gray-700">Guest</th>
                  <th className="py-2 text-left text-sm font-medium text-gray-700">Check-in</th>
                  <th className="py-2 text-left text-sm font-medium text-gray-700">Check-out</th>
                  <th className="py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="py-2 text-sm text-gray-700">{booking.guest}</td>
                    <td className="py-2 text-sm text-gray-700">{booking.checkIn}</td>
                    <td className="py-2 text-sm text-gray-700">{booking.checkOut}</td>
                    <td className="py-2 text-sm text-gray-700">{booking.status}</td>
                    <td className="py-2">
                      {booking.status === 'Pending' && (
                        <>
                          <Button
                            onClick={() => handleApproveBooking(booking.id)}
                            className="mr-2 w-20 bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="w-20 bg-red-600 hover:bg-red-700"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Revenue Dashboard */}
          <Card className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-8 w-8 text-blue-500 mr-4" />
              <h2 className="text-2xl font-semibold text-gray-800">Revenue Dashboard</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-800">Total Earnings</span>
                <span className="ml-4 text-2xl font-bold text-teal-600">$3,200</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-indigo-500 mr-2" />
                <span className="text-lg font-semibold text-gray-800">Upcoming Bookings: 5</span>
              </div>
            </div>
            <Button className="w-full text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-all mt-4">
              View Analytics
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
