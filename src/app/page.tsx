'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredItems = [
    { title: 'Beach Getaways', image: '/stay-1.jpg' },
    { title: 'Mountain Retreats', image: '/stay-2.jpg' },
    { title: 'City Escapes', image: '/stay-3.jpg' },
  ];

  // Auto-slide the featured items every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  return (
    <div className="bg-gray-100 w-screen h-screen overflow-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-[60vh] flex items-center justify-center">
        <div className="text-center text-white px-8">
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to <span className="text-yellow-300">Easy-Stay</span>
          </h1>
          <p className="text-lg mb-8">
            Your perfect homestay experience starts here. Explore or host today!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/host-login">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium text-lg hover:bg-purple-100 shadow-lg transition transform hover:scale-105">
                Host Login
              </button>
            </Link>
            <Link href="/customer-login">
              <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium text-lg hover:bg-pink-100 shadow-lg transition transform hover:scale-105">
                Customer Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section with Sliding Animation */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Explore Top Destinations
        </h2>
        <div className="relative overflow-hidden h-64">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredItems.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-full">
                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1280}
                    height={720}
                    className="h-64 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-purple-600 py-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Start Your Journey Today!</h2>
        <p className="mb-6">
          Whether you're looking for a perfect stay or want to become a host, we've got you covered.
        </p>
        <Link href="/signup">
          <button className="bg-yellow-400 text-purple-800 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-500 shadow-lg transition transform hover:scale-105">
            Sign Up Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
