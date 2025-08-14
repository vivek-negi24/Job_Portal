'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ApplyJobPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    experience: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJobTitle(data.title || 'Job'));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  console.log('🚀 Params:', params);
  console.log('🚀 Job ID:', id);
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const token = localStorage.getItem('user_token'); 
  
    if (!token) {
      return setError('You must be logged in to apply.');
    }
  
    try {
      const res = await fetch(`http://localhost:3000/api/application/apply/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
          experience: form.experience
        })
      });
  
      const data = await res.json();  // ✅ Only parse once
  
      if (res.ok) {
        alert('✅ Application submitted successfully!');
        router.push('/jobportal');
      } else {
        setError(data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error or network issue');
    }
  };
  
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded text-black">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Apply for: {jobTitle}</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="w-full border px-4 py-2 rounded" />
        <input name="email" value={form.email} type="email" onChange={handleChange} required placeholder="Email" className="w-full border px-4 py-2 rounded" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border px-4 py-2 rounded" />
        <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience" className="w-full border px-4 py-2 rounded" />

        <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
          Submit Application
        </button>
      </form>
    </div>
  );
}
