'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) return;

    fetch(`http://localhost:3000/api/admin/dashboard/users/${id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
      .then(res => res.json())
      .then(data =>{
            console.log("user data",data)
          setUserData(data)
      }
        )
      .catch(() => setError('Failed to fetch user data'));
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!userData) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <p><strong>Name:</strong> {userData.user?.name || 'N/A'}</p>
      <p><strong>Email:</strong> {userData.user?.email || 'N/A'}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Applied Jobs</h2>
      {userData.applications?.length === 0 ? (
        <p>No job applications yet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {(userData.applications|| []).map((app) => (
            <li key={app._id}>
              <strong>{app.jobId?.title || 'Deleted Job'}</strong> — Applied on {new Date(app.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
