'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import ClubIcon from '@/components/ui/club-icon';
import { usersData } from '@/data/mock-data';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('User API response:', data);

            // Handle the specific response structure from the API
            if (data && data.data && data.data.user_id) {
              // Transform the API response to match our UI structure
              const transformedUser = {
                id: data.data.user_id,
                name: data.data.full_name || data.data.email.split('@')[0], // Use full_name if available, otherwise use email username
                email: data.data.email,
                type: data.data.role.role_name === 'admin' ? 'product' :
                      data.data.role.role_name === 'client' ? 'website' : 'icon',
                dateAdded: new Date().toLocaleDateString(), // API doesn't provide this, using current date
                role: data.data.role.role_name.charAt(0).toUpperCase() + data.data.role.role_name.slice(1), // Capitalize role name
                status: data.data.is_email_verified ? "Active" : "Inactive",
                lastLogin: "Recently", // API doesn't provide this
                roleId: data.data.role.role_id,
                permissions: data.data.role.permissions
              };
              setUser(transformedUser);
            } else if (data && data.user_id) {
              // Direct user object in data
              const transformedUser = {
                id: data.user_id,
                name: data.full_name || data.email.split('@')[0],
                email: data.email,
                type: data.role.role_name === 'admin' ? 'product' :
                      data.role.role_name === 'client' ? 'website' : 'icon',
                dateAdded: new Date().toLocaleDateString(),
                role: data.role.role_name.charAt(0).toUpperCase() + data.role.role_name.slice(1),
                status: data.is_email_verified ? "Active" : "Inactive",
                lastLogin: "Recently",
                roleId: data.role.role_id,
                permissions: data.role.permissions
              };
              setUser(transformedUser);
            } else if (data && data.id) {
              // Old format
              setUser(data);
            } else if (data && data.data && data.data.id) {
              // Old format in data property
              setUser(data.data);
            } else {
              console.error('Unexpected user data structure, using fallback data');
              // Find user in mock data
              const mockUser = usersData.find(u => u.id.toString() === userId);
              setUser(mockUser || null);
            }
          } else {
            console.error('Failed to fetch user, using fallback data');
            // Find user in mock data
            const mockUser = usersData.find(u => u.id.toString() === userId);
            setUser(mockUser || null);
          }
        } catch (err) {
          console.error('Error fetching user, using fallback data:', err);
          // Find user in mock data
          const mockUser = usersData.find(u => u.id.toString() === userId);
          setUser(mockUser || null);
        }
      } catch (err) {
        setError('An error occurred while fetching the user');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router]);

  if (loading) {
    return (
      <MainLayout title="User Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading user details...</span>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout title="User Details">
        <div className="bg-red-50 p-4 rounded-lg text-red-500 mb-4">
          {error || "User not found"}
        </div>
        <Button asChild>
          <Link href="/users">Back to Users</Link>
        </Button>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`User: ${user.name}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Details</h1>
          <Link
            href="/users"
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Users
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <ClubIcon type={user.type as any} className="h-16 w-16" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg">{user.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {user.status}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">User ID</h3>
              <p className="mt-1 text-sm text-gray-600 break-all">{user.id}</p>
            </div>
            {user.roleId && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role ID</h3>
                <p className="mt-1 text-sm text-gray-600 break-all">{user.roleId}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date Added</h3>
              <p className="mt-1 text-lg">{user.dateAdded}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
              <p className="mt-1 text-lg">{user.lastLogin}</p>
            </div>
            {user.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-lg">{user.phone}</p>
              </div>
            )}
            {user.permissions !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
                <p className="mt-1 text-lg">{user.permissions}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-8">
            <Button asChild variant="outline">
              <Link href={`/users/new?edit=${user.id}`}>
                Edit User
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
