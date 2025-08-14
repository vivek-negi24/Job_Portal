'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BusinessOwnerDetailsPage() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    fetch(`http://localhost:3000/api/admin/dashboard/business-owners/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOwner(data))
      .catch(() => setError('Failed to fetch owner details'));
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!owner) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded text-black">
      <h1 className="text-2xl font-bold mb-4">Business Owner Details</h1>
      <p><strong>Name:</strong> {owner.name}</p>
      <p><strong>Email:</strong> {owner.email}</p>
      <p><strong>Company:</strong> {owner.company || 'N/A'}</p>
      <p><strong>Registered At:</strong> {new Date(owner.createdAt).toLocaleDateString()}</p>
      <p><strong>Total Jobs Posted:</strong> {owner.jobCount}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Posted Jobs</h2>
      <ul className="space-y-2">
        {owner.jobs?.map((job) => (
          <li key={job._id} className="p-4 border rounded bg-gray-50">
            <p><strong>{job.title}</strong> - {job.location}</p>
            <p className="text-sm text-gray-600">{job.category} | {job.salary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
