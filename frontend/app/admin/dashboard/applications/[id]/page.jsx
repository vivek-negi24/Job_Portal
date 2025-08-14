'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminApplicationDetailsPage() {
  const { id } = useParams();
  const [appData, setAppData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    fetch(`http://localhost:3000/api/admin/dashboard/applications/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then(res => res.json())
      .then(data => {
        setAppData(data);
      })
      .catch(() => setError('Failed to fetch application details'));
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!appData) return <p className="text-center text-gray-500 mt-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Application Details</h1>

      <h2 className="text-lg font-semibold mb-2">Applicant Info</h2>
      <p><strong>Name:</strong> {appData.applicant?.name}</p>
      <p><strong>Email:</strong> {appData.applicant?.email}</p>
      <p><strong>Address:</strong> {appData.applicant?.address}</p>
      <p><strong>Experience:</strong> {appData.applicant?.experience}</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Job Info</h2>
      <p><strong>Title:</strong> {appData.job?.title}</p>
      <p><strong>Company:</strong> {appData.job?.company}</p>
      <p><strong>Location:</strong> {appData.job?.location}</p>
      <p><strong>Catagory:</strong> {appData.job?.catagory}</p>
      

      <p className="mt-6"><strong>Applied On:</strong> {new Date(appData.appliedOn).toLocaleDateString()}</p>
    </div>
  );
}
