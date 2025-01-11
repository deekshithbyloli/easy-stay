import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">About EasyStay</h3>
            <p className="text-sm">
              EasyStay helps you find and host perfect homestays. Explore destinations and connect with amazing hosts today!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="hover:text-indigo-400">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-indigo-400">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.56v14.91c0 .94-.77 1.71-1.71 1.71H1.71C.77 21.18 0 20.41 0 19.47V4.56c0-.94.77-1.71 1.71-1.71H22.3c.94 0 1.71.77 1.71 1.71z" />
                  <path d="M7.07 19.2H3.2V8.82h3.87v10.38zM5.14 7.35C3.87 7.35 3 6.48 3 5.22 3 4 3.92 3 5.14 3c1.21 0 2.14 1 2.14 2.22-.01 1.26-.93 2.13-2.14 2.13zM20.81 19.2h-3.87v-5.64c0-1.41-.52-2.37-1.74-2.37-1.04 0-1.66.71-1.94 1.4-.1.25-.12.61-.12.96v5.66h-3.87v-10.38h3.72v1.41h.05c.51-.77 1.42-1.77 3.45-1.77 2.38 0 4.16 1.55 4.16 4.88v5.86h-.01z" />
                </svg>
              </a>
              <a href="#" className="hover:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.04c6.63 0 12 5.37 12 12 0 5.3-4.3 9.6-9.6 9.6-2.32 0-4.48-.74-6.24-2.04.31.03.64.05.96.05 1.93 0 3.7-.66 5.11-1.77-1.8-.03-3.31-1.23-3.83-2.87.25.05.51.07.78.07.38 0 .76-.05 1.11-.15-1.89-.38-3.31-2.04-3.31-4.03v-.05c.55.31 1.17.5 1.85.53-1.09-.73-1.8-1.96-1.8-3.37 0-.73.2-1.42.55-2.02 2.01 2.47 5.02 4.1 8.41 4.27-.06-.29-.09-.58-.09-.88 0-2.13 1.73-3.87 3.87-3.87 1.11 0 2.11.47 2.81 1.22.88-.17 1.7-.5 2.45-.94-.29.88-.89 1.63-1.68 2.1.78-.09 1.51-.3 2.2-.61-.52.76-1.16 1.41-1.92 1.93z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
