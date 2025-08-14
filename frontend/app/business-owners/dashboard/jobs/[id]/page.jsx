'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [userData , setUserData] = useState([]);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const ownerToken = localStorage.getItem('owner_token');
    if (!ownerToken) return;

    fetch(`http://localhost:3000/api/business-owners/dashboard/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${ownerToken}`
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

//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3000/api/business-owners/dashboard/jobs/${id}`)
//       .then((res) => res.json())
//       .then((data) =>{
//         console.log("🧾 Received Job Data:", data);
//         setJob(data)
//       }
//     )
//       .catch(() => router.push('/business-owners/dashboard'));
//   }, [id]);

  // if (!job) {
  //   return <p className="text-center py-10 text-gray-700">Loading job details...</p>;
  // }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10 text-gray-800">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">{job?.title}</h1>
      <p className="mb-2"><strong>Company:</strong> {job?.company}</p>
      <p className="mb-2"><strong>Location:</strong> {job?.location}</p>
      <p className="mb-2"><strong>Salary:</strong> {job?.salary || 'Not specified'}</p>
      <p className="mb-2"><strong>Posted On:</strong> {job?.date || 'Not available'}</p>
      <p className="mb-2"><strong>Category:</strong> {job?.category || 'Not specified'}</p>
      <p className="mb-4"><strong>Tags:</strong> {job?.tags?.join(', ') || 'None'}</p>

      
    </div>
  );
}
