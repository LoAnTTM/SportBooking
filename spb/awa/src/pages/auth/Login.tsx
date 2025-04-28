import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../layouts/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login({ email, password });
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-900">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold">Admin Login</h1>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-900 py-2 px-4 font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;