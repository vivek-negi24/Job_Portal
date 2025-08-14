'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [userData , setUserData] = useState([]);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   if (!id) return;

  //   fetch(`http://localhost:3000/api/jobs/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => setJob(data.jobs))
  //     .catch(() => router.push('/jobportal'));
  // }, [id]);

  useEffect(() => {
    if (!id) return;
    
    fetch(`http://localhost:3000/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched job data:', data);
        setJob(data.jobs); // ✅ Correct assignment
      })
      .catch(err => {
        console.error('Failed to fetch job details', err);
        router.push('/jobportal'); // Redirect if job not found
      });
  }, [id]);
  

  // useEffect(() => {
  //   const userToken = localStorage.getItem('user_token');
  //   if (!userToken) return;

  //   fetch(`http://localhost:3000/api/jobs/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${userToken}`
  //     }
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("📦 Job data:", data);
  //       // console.log("📦 apllicant data:", data.applicants);
  //       setJob(data.jobs);           // ✅ Update this line
  //       // setUserData({applicants:data.applicants}); // ✅ Separate applicants
  //     })
  //     .catch(() => setError('Failed to fetch job data'));
  // }, [id]);

  if (!job) {
    return <p className="text-center py-10 text-gray-700">Loading job details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10 text-gray-800">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">{job?.title}</h1>
      <p className="mb-2"><strong>Company:</strong> {job?.company}</p>
      <p className="mb-2"><strong>Location:</strong> {job?.location}</p>
      <p className="mb-2"><strong>Salary:</strong> {job?.salary || 'Not specified'}</p>
      <p className="mb-2"><strong>Posted On:</strong> {job?.date || 'Not available'}</p>
      <p className="mb-2"><strong>Category:</strong> {job?.category || 'Not specified'}</p>
      <p className="mb-4"><strong>Tags:</strong> {job?.tags?.join(', ') || 'None'}</p>

      {/* <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
        onClick={() => {
        console.log("🚀 Applying for Job ID:", job?._id);
        if (job?._id) {
          router.push(`/jobportal/application/apply/${job._id}`);
        } else {
          alert('Job ID missing. Cannot apply.');
        }
      }}
      >
        Apply Now
      </button> */}

      {job?._id ? (
  <button
    onClick={() => {
      console.log('🚀 Navigating to apply with Job ID:', job._id);
      router.push(`/jobportal/application/apply/${job._id}`);
    }}
    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
  >
    Apply Now
  </button>
) : (
  <p className="text-gray-500">Job ID not available yet.</p>
)}

    </div>
  );
}
