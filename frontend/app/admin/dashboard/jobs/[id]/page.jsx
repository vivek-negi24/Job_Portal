'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminJobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [userData , setUserData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    fetch(`http://localhost:3000/api/admin/dashboard/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("📦 Job data:", data);
        console.log("📦 apllicant data:", data.applicants);
        setJob(data.jobs);           // ✅ Update this line
        setUserData({applicants:data.applicants}); // ✅ Separate applicants
      })
      .catch(() => setError('Failed to fetch job data'));
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!job) return <p className="text-gray-600">Loading job details...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">{job.title || 'N/A'}</h1>
      <p><strong>Company:</strong> {job.company || 'N/A'}</p>
      <p><strong>Location:</strong> {job.location || 'N/A'}</p>
      <p><strong>Salary:</strong> {job.salary || 'Not specified'}</p>
      <p><strong>Category:</strong> {job.category || 'N/A'}</p>
      <p><strong>Posted On:</strong> {job.date || 'Not available'}</p>
      <p className="mb-4"><strong>Tags:</strong> {job.tags?.join(', ') || 'None'}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Applicants</h2>
      {userData?.applicants?.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {(userData?.applicants || []).map((app) => (
            <li key={app._id}>
              <strong>{app.name}</strong> — {app.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
