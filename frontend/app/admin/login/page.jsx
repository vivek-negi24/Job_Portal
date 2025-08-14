'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Control render visibility

  // ⏩ Check token and redirect
  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:3000/api/admin-only-data', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          router.push('/admin/dashboard');
        } else {
          localStorage.removeItem('admin_token');
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.user?.role === 'admin') {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Server error or network issue');
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-600">Loading...</div>; // ⛔ prevent blink

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded text-black">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Admin Email"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600"
        >
          Login
        </button>
      </form>
    </div>
    </div>
  );
}
