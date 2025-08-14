'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BusinessOwnerAuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/api/business-owners/login' : '/api/business-owners/register';

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        if (mode === 'login') {
          localStorage.setItem('owner_token', data.token); // ✅ Save token here
          router.push('/business-owners/dashboard');
        } else {
          setMode('login');
          setError('✅ Registered! Now login.');
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch {
      setError('Server error or network issue');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {mode === 'login' ? 'Business Owner Login' : 'Business Owner Register'}
        </h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {mode === 'register' && (
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full border px-3 py-2 rounded"
          />
        )}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded"
        />
            <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
        <p className="text-center text-sm">
          {mode === 'login' ? 'No account?' : 'Already registered?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-orange-600 underline"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}
