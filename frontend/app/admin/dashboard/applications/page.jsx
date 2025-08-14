'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const perPage = 5;

  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!adminToken) return;

    fetch('http://localhost:3000/api/admin/dashboard/applications', {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setApplications(Array.isArray(data) ? data : []))
      .catch(() => console.error('❌ Failed to fetch applications'));
  }, []);

  const filteredApps = applications.filter(app =>
    (app.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (app.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (app.jobTitle?.toLowerCase() || '').includes(search.toLowerCase())
  );
  const totalApplications = filteredApps.length;
  const totalPages = Math.ceil(totalApplications / perPage);
  const currentApps = filteredApps.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="p-4 sm:p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">All Job Applications</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or job title"
          className="w-full sm:max-w-md px-4 py-2 border border-orange-300 rounded text-orange-600 placeholder-orange-400"
        />
        <span className="text-sm text-gray-600">Total Applications: {totalApplications}</span>
      </div>

      {currentApps.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-200 text-left text-sm font-semibold">
                <tr>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Job Title</th>
                  <th className="p-3">Applied On</th>
                  <th className="p-3">View Details</th>
                </tr>
              </thead>
              <tbody>
                {currentApps.map(app => (
                  <tr key={app._id} className="border-t hover:bg-orange-50">
                    <td className="p-3">{app.name}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">{app.jobTitle}</td>
                    <td className="p-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => router.push(`/admin/dashboard/applications/${app._id}`)}
                        className="bg-orange-600 px-3 py-1  text-white rounded"
                      >
                        view details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-orange-500 text-white' : ''}`}
              >
                {i + 1}
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
        </>
      )}
    </div>
  );
}
