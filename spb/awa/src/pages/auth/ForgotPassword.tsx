import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: New Password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification code has been sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-forgot-password-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token: parseInt(token, 10) }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Token verified successfully.');
        setStep(3);
      } else {
        setError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          token: parseInt(token, 10), 
          password: newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password has been reset successfully.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit}>
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
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-900 py-2 px-4 font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        );
      
      case 2:
        return (
          <form onSubmit={handleVerifyToken}>
            <div className="mb-4">
              <label
                htmlFor="token"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="Enter verification code"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-900 py-2 px-4 font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        );
      
      case 3:
        return (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-900 py-2 px-4 font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        );
      
      default:
        return null;
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
          <h1 className="mb-6 text-center text-2xl font-bold">Sport Booking</h1>
          <h2 className="mb-6 text-center text-xl font-semibold">Forgot Password</h2>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-500">
              {success}
            </div>
          )}
          
          {renderStep()}
          
          <div className="mt-4 text-center text-sm">
            <a href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
