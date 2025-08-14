'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from './DashboardContext'; // import context

export default function BusinessOwnerDashboard() {
  const { searchTerm, selectedCategory } = useDashboard();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('owner_token');
    if (!token) return;

    fetch('http://localhost:3000/api/owners/jobs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Failed to fetch jobs:', err));
  }, []);

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      })
    : [];

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-600">Jobs You Posted</h1>
        <button
          onClick={() => router.push(`/business-owners/dashboard/post-job`)}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          + Post a Job
        </button>
      </div>

      {/* Posted Jobs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedJobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
            <p className="text-gray-700 mb-1">{job.company}</p>
            <p className="text-sm text-gray-500 mb-2">{job.location}</p>
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              {job.category}
            </span>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => router.push(`/business-owners/dashboard/jobs/${job._id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center text-black gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
