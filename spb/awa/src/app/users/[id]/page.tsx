'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usersData } from "@/data/mock-data";
import ClubIcon from "@/components/ui/club-icon";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
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
            
            // Handle different response structures
            if (data && data.id) {
              setUser(data);
            } else if (data && data.data && data.data.id) {
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
          </div>

          <div className="flex space-x-2 mt-8">
            <Button asChild variant="outline">
              <Link href={`/users/${user.id}/edit`}>
                Edit User
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
