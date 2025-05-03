"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { validateUserRole } from '@/utils/auth-utils';

import Header from './header';
import Sidebar from './sidebar';

interface ClientWrapperProps {
  children: React.ReactNode;
  title: string;
  showSearch?: boolean;
}

const ClientWrapper = ({ children, title, showSearch = false }: ClientWrapperProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else {
      try {
        // Parse user to check role
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
          // Clear invalid user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/auth/login');
        } else {
          setIsAuthenticated(true);
          // Validate user role
          validateUserRole();
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} showSearch={showSearch} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default ClientWrapper;
