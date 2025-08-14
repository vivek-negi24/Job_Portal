'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserDashboard } from './userDashboardContext'; // Import Context

export default function JobPortalPage() {
  const { searchTerm, selectedCategory } = useUserDashboard();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
 
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/api/jobs')
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
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-orange-600">Available Jobs</h1>

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
                  onClick={() => router.push(`/jobportal/job/${job._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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
      </main>
    </div>
  );
}
