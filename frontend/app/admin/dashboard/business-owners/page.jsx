'use client';
import { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation';

export default function AdminBusinessOwnersPage() {
  const [owners, setOwners] = useState([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) return;

    fetch('http://localhost:3000/api/admin/dashboard/business-owners', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOwners(Array.isArray(data) ? data : []))
      .catch(err => console.error('❌ Fetch error:', err));
  }, []);

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOwners = filteredOwners.length;
  const totalPages = Math.ceil(totalOwners / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentOwners = filteredOwners.slice(startIndex, startIndex + perPage);

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this owner?');
    if (confirm) {
      console.log('🚨 Delete owner with ID:', id);
      // You can implement actual deletion logic here
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Registered Business Owners</h1>

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded text-orange-600 placeholder-orange-400 w-full sm:w-1/2"
        />
        <p className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + perPage, totalOwners)} of {totalOwners} owners
        </p>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOwners.map(owner => (
            <tr key={owner._id}>
              <td className="p-3 border-t">{owner.name}</td>
              <td className="p-3 border-t">{owner.email}</td>
              <td className="p-3 border-t">{owner.company || 'N/A'}</td>
              <td className="p-3 border-t space-x-2">
                        <button
            onClick={() => router.push(`/admin/dashboard/business-owners/${owner._id}`)}
            className="bg-orange-600 px-3 py-1  text-white rounded"
          >
            View Details
          </button>

                {/* <button
                  onClick={() => alert(`✏️ Edit ${owner.name}`)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(owner._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex gap-2 justify-center">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? 'bg-orange-500 text-white' : ''}`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
