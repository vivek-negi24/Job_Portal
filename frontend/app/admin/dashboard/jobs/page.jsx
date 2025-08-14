'use client';

import { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const jobsPerPage = 5;

  // Fetch jobs
  useEffect(() => {
    fetch('http://localhost:3000/api/jobs')
      .then(res => res.json())
      .then(data => {
        const validJobs = Array.isArray(data) ? data : [];
        setJobs(validJobs);
        setFilteredJobs(validJobs);
      });
  }, []);

  // Search filtering
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query)
    );
    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, jobs]);

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const indexOfFirst = (currentPage - 1) * jobsPerPage;
  const indexOfLast = Math.min(indexOfFirst + jobsPerPage, totalJobs);
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">All Posted Jobs</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by job title or company..."
        className="mb-4 px-4 py-2 border rounded w-full max-w-md text-orange-600 placeholder-orange-400"
      />

      {/* Showing Range */}
      <p className="text-sm text-gray-600 mb-2">
        Showing {indexOfFirst + 1} to {indexOfLast} of {totalJobs} jobs
      </p>

      {/* Jobs Table */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Job Title</th>
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentJobs.map((job) => (
            <tr key={job._id}>
              <td className="p-3 border-t">{job.title}</td>
              <td className="p-3 border-t">{job.company}</td>
              <td className="p-3 border-t">{job.location}</td>
              <td className="p-3 border-t">{job.category}</td>
              <td className="p-3 border-t">
                <button
                  className="bg-orange-600 px-3 py-1  text-white rounded"
                  onClick={() => router.push(`/admin/dashboard/jobs/${job._id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
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
            className={`px-3 py-1 border rounded ${
              currentPage === idx + 1 ? 'bg-orange-500 text-white' : ''
            }`}
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

      {/* Job Details Popup */}
      {selectedJob && (
        <div className="mt-6 p-4 bg-white border border-orange-300 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Job Details</h2>
          <p><strong>Title:</strong> {selectedJob.title}</p>
          <p><strong>Company:</strong> {selectedJob.company}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Category:</strong> {selectedJob.category}</p>
          <p><strong>Salary:</strong> {selectedJob.salary || 'Not specified'}</p>
          <p><strong>Tags:</strong> {selectedJob.tags?.join(', ') || 'None'}</p>
          <p><strong>Job ID:</strong> {selectedJob._id}</p>
          <p><strong>Date:</strong> {selectedJob.date ? new Date(selectedJob.date).toLocaleDateString() : 'Not Available'}</p>
          <button
            onClick={() => setSelectedJob(null)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
