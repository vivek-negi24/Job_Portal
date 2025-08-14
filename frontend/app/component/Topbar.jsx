'use client';

import { Search, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function Topbar({
  children
}) 

{
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [user, setUser] = useState(null);
  const categories = ['Full Stack', 'App Development', 'Frontend', 'Backend', 'DevOps'];

  const filteredJobs = Array.isArray(jobs)
  ? jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    })
  : [];

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/jobportal/logout', {
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

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-orange-300 text-orange-600 rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

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
