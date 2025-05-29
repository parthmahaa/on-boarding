import React, { useEffect, useState } from 'react';
import { API_URL } from '../services/api';
import type { Employee,ApiResponse } from '../utilities/types';
import { useNavigate } from 'react-router-dom';
import { encrypt } from '../utilities/encrypt';
import { toast } from 'react-toastify';

// ---------- Login Component ----------
const Login: React.FC<{}> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /home if already logged in
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const response: ApiResponse = await res.json();

      if (response.error) {
        throw new Error(response.message || 'Invalid credentials.');
      }

      // Store user details in localStorage for current session
      // Adjust field names as per your API response structure
      const userDetails = {
        name: `${response.data?.firstName || ''} ${response.data?.lastName || ''}`.trim(),
        email: response.data?.email || email,
        phone: response.data?.phone || '',
      };
      const companyDetails = {
        companyName : response.data?.companyName,
        companyId : response.data?.companyId
      }
      const userRoles = response.data?.role || ''

      localStorage.setItem('companyDetails', encrypt(companyDetails))
      localStorage.setItem("userDetails" ,encrypt(userDetails))
      localStorage.setItem("userRoles" ,encrypt(userRoles))
      localStorage.setItem("token", "sdadasdasdasdadasd")
      
      navigate('/')
    } catch (err: any) {
      toast.error(err.message)
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
        <p className="text-gray-600 mb-6">Please use the credentials sent to your email.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;