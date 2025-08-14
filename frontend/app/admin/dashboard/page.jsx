'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalBusinessOwners: 0,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!adminToken) {
      setError('Admin token not found');
      return;
    }

    fetch('http://localhost:3000/api/admin/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch stats:', err);
        setError('Failed to fetch statistics');
      });
  }, []);

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold text-orange-600">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold text-orange-600">Total Jobs</h2>
          <p className="text-3xl font-bold">{stats.totalJobs}</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold text-orange-600">Total Applications</h2>
          <p className="text-3xl font-bold">{stats.totalApplications}</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-semibold text-orange-600">Total Business Owners</h2>
          <p className="text-3xl font-bold">{stats.totalBusinessOwners}</p>
        </div>
      </div>
    </div>
  );
}
