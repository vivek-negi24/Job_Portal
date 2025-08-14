'use client';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-orange-500 text-white p-4 w-full lg:w-64 ${
          menuOpen ? 'block' : 'hidden'
        } lg:block`}
      >
        <h2 className="text-xl font-bold mb-4 lg:block hidden">Admin Panel</h2>

        {/* Nav: stack vertical on large, horizontal on small */}
        <nav
          className={`${
            menuOpen ? 'flex flex-col space-y-2' : 'flex flex-row gap-4 justify-around'
          } lg:flex lg:flex-col lg:space-y-2`}
        >
          <Link href="/admin/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/dashboard/users" className="hover:underline">
            All Users
          </Link>
          <Link href="/admin/dashboard/business-owners" className="hover:underline">
            Business Owners
          </Link>
          <Link href="/admin/dashboard/jobs" className="hover:underline">
            Jobs
          </Link>
          <Link href="/admin/dashboard/applications" className="hover:underline">
            Applications
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-4 sm:p-6">
        {/* Responsive Topbar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-orange-500 font-bold text-lg"
          >
            ☰
          </button>
          {/* <div className="relative w-full max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none placeholder-orange-400 text-black"
            />
          </div> */}
        </div>

        {children}
      </main>
    </div>
  );
}
