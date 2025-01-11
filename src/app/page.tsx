'use client';

import Link from 'next/link';

function Home() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 w-screen h-screen flex items-center justify-center">
      <div className="text-center text-white p-6 max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-4 text-gradient bg-clip-text">
          Welcome to Easy-Stay
        </h1>
        <p className="text-xl mb-8">
          Find your perfect homestay or become a host in just a few clicks!
        </p>

        <div className="flex justify-center gap-6">
          <Link href="/host-login">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none">
              Sign in as Host
            </button>
          </Link>
          <Link href="/customer-login">
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none">
              Sign in as Customer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
