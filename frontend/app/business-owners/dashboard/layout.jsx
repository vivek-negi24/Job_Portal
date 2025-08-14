'use client';

import { Search, LogOut, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardProvider, useDashboard } from './DashboardContext'; // import context

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </DashboardProvider>
  );
}

function DashboardLayoutContent({ children }) {
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useDashboard();

  const categories = ['Full Stack', 'App Development', 'Frontend', 'Backend', 'DevOps'];

  useEffect(() => {
    const token = localStorage.getItem('owner_token');
    if (!token) return;
    fetch('http://localhost:3000/api/business-owner/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOwner(data))
      .catch(() => setOwner(null));
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/business-owner/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('business_token');
    router.push('/business-owners/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <UserCircle className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{owner?.name || 'Business Owner'}</p>
            <p className="text-sm text-gray-500">{owner?.email || 'Not logged in'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
            <Search className="text-orange-400 mr-2" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="outline-none w-48 text-orange-600 placeholder-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category dropdown */}
          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-orange-300 text-orange-600 rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select> */}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            <LogOut className="inline w-4 h-4 mr-1" /> Logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
