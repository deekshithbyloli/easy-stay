'use client';

import Link from 'next/link';

function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Easy<span className="text-pink-500">Stay</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/explore" className="text-gray-700 hover:text-indigo-600 transition">
            Explore
          </Link>
          <Link href="/host" className="text-gray-700 hover:text-indigo-600 transition">
            Become a Host
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition">
            Contact
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <button className="text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:border-indigo-600 hover:text-indigo-600 transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="block md:hidden text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
