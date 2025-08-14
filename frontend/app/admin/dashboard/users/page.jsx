'use client';

import { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation';
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
   const router = useRouter();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const usersPerPage = 4;

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
  
    fetch('http://localhost:3000/api/admin/dashboard/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const validUsers = Array.isArray(data) ? data : [];
        setUsers(validUsers);
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setError('Failed to fetch users');
      });
  }, []);
  

  

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset page
  }, [searchQuery, users]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfFirst = (currentPage - 1) * usersPerPage;
  const indexOfLast = Math.min(indexOfFirst + usersPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">All Registered Users</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or email..."
        className="mb-4 px-4 py-2 border rounded w-full max-w-md text-orange-600 placeholder-orange-400"
      />

      {/* Display Info */}
      <p className="text-sm mb-2 text-gray-600">
        Showing {indexOfFirst + 1} to {indexOfLast} of {filteredUsers.length} users
      </p>

      {/* Users Table */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td className="p-3 border-t">{user.name}</td>
              <td className="p-3 border-t">{user.email}</td>
              <td className="p-3 border-t">
                <button
                  className="bg-orange-600 px-3 py-1  text-white rounded"
                  onClick={() => router.push(`/admin/dashboard/users/${user._id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* User Detail Card
      {selectedUser && (
        <div className="mt-6 p-4 bg-white border border-orange-300 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Jobs Posted:</strong> {selectedUser.jobs?.length || 0}</p>
          <p><strong>Applications:</strong> {selectedUser.applications?.length || 0}</p>
          <button
            onClick={() => setSelectedUser(null)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )} */}
    </div>
  );
}
