'use client';

import { Search, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserDashboard, UserDashboardProvider } from './userDashboardContext'; // Import Context

export default function Topbar({ children }) {
  return (
    <UserDashboardProvider>
      <TopbarContent>
        {children}
      </TopbarContent>
    </UserDashboardProvider>
  );
}

function TopbarContent({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useUserDashboard();

  

  useEffect(() => {
    fetch('http://localhost:3000/api/user/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <UserCircle className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{user?.name || 'Guest'}</p>
            <p className="text-sm text-gray-500">{user?.email || 'Not logged in'}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto">
          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 w-full sm:w-64 bg-white">
            <Search className="text-orange-400 mr-2" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="outline-none w-full text-orange-600 placeholder-orange-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
