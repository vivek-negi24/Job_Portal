'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    category: '',
    salary: '',
    tags: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('owner_token');
    console.log('🔍 owner_token available:', token);
  }, []);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const token = localStorage.getItem('owner_token'); 
    console.log('🔑 owner_token from localStorage:', token);
  
    if (!token) {
      setError('You must be logged in as a business owner to post a job.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/jobs', { // no change here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(tag => tag.trim()),
          date: new Date(),
        }),
      });
  
      const data = await res.json();
      console.log('📬 Job Submit Response:', data);
  
      if (res.ok) {
        alert('✅ Job posted successfully!');
        router.push('/business-owners/dashboard');
      } else {
        setError(data.message || 'Failed to post job');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setError('Network error, try again.');
    }
  };
  


  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded text-black">
      <h1 className="text-xl font-bold mb-4">Post a New Job</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'company', 'location', 'category', 'salary', 'tags'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        ))}
        <button 
      
          type="submit"
          className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
