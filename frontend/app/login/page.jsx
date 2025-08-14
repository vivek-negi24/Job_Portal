'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserAuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    localStorage.removeItem('user_token');

    const endpoint = mode === 'login' ? '/api/user/login' : '/api/user/register';

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include', // ensures the cookie is set by server
      });

      const data = await res.json();

      if (res.ok) {
        if (mode === 'login') {
          // Save JWT to localStorage for frontend access (if needed)
          if (data.token) {
            localStorage.setItem('user_token', data.token);
          }
          router.push('/jobportal');
        } else {
          setMode('login');
          setForm({ name: '', email: '', password: '' });
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">
          {mode === 'login' ? 'User Login' : 'User Register'}
        </h1>

        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
          {mode === 'register' && (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border px-4 py-2 rounded text-sm"
              required
            />
          )}
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border px-4 py-2 rounded text-sm"
            required
          />
          
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border px-4 py-2 rounded text-sm"
            required
          />

          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600 transition"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-800">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button className="text-orange-600 underline" onClick={() => setMode('register')}>
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button className="text-orange-600 underline" onClick={() => setMode('login')}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
