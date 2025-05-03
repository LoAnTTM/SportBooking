'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Define the Role interface
interface Role {
  role_id: string;
  role_name: string;
  permissions: number;
}

export default function NewUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editUserId = searchParams?.get('edit');
  const isEditMode = !!editUserId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user', // Default role name
    is_email_verified: true
  });

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Roles API response:', data);

            // Handle the specific response structure from the API
            if (data && data.data && Array.isArray(data.data)) {
              setRoles(data.data);
            } else {
              console.error('Unexpected roles data structure, using empty array');
              setRoles([]);
            }
          } else {
            console.error('Failed to fetch roles');
            setRoles([]);
          }
        } catch (err) {
          console.error('Error fetching roles:', err);
          setRoles([]);
        }
      } catch (err) {
        console.error('Error in fetchRoles:', err);
      }
    };

    fetchRoles();
  }, [router]);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/auth/login');
            return;
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${editUserId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('User API response for edit:', data);

            // Handle the specific response structure from the API
            if (data && data.data && data.data.user_id) {
              // Set form data from API response
              setFormData({
                full_name: data.data.full_name || '',
                email: data.data.email,
                password: '', // Don't populate password for security
                phone: data.data.phone || '',
                role: data.data.role.role_name,
                is_email_verified: data.data.is_email_verified
              });
            } else if (data && data.user_id) {
              // Direct user object in data
              setFormData({
                full_name: data.full_name || '',
                email: data.email,
                password: '', // Don't populate password for security
                phone: data.phone || '',
                role: data.role.role_name,
                is_email_verified: data.is_email_verified
              });
            } else {
              setError('Could not load user data in the expected format');
            }
          } else {
            setError('Failed to load user data');
          }
        } catch (err) {
          console.error('Error fetching user for edit:', err);
          setError('An error occurred while loading user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [isEditMode, editUserId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_email_verified: checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Find the role_id for the selected role name
      const selectedRole = roles.find(role => role.role_name === formData.role);
      let roleId: string;

      if (selectedRole) {
        // Use the role_id from the fetched roles
        roleId = selectedRole.role_id;
      } else {
        // Fallback to hardcoded role IDs if roles weren't fetched successfully
        const roleIdMap = {
          'admin': 'cc203bb9-7b33-4391-8917-0089588356f2',
          'client': '6c8647dc-091f-4249-b9f7-12bed594d124',
          'client_member': 'bcb2b9aa-9b1d-47dc-9d29-f7b142df79ed',
          'user': '9666740a-4ff5-4d22-830f-ab3361ba5ef4'
        };
        roleId = roleIdMap[formData.role as keyof typeof roleIdMap] || roleIdMap.user;
      }

      // Prepare request body - don't include password if it's empty in edit mode
      const requestBody: any = {
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone, // Include phone parameter
        role_id: roleId,
        is_email_verified: formData.is_email_verified
      };

      // Only include password if it's not empty
      if (formData.password) {
        requestBody.password = formData.password;
      }

      // Remove phone if it's empty
      if (!formData.phone) {
        delete requestBody.phone;
      }

      // Determine if we're creating or updating a user
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/${editUserId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/users`;

      const method = isEditMode ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`User ${isEditMode ? 'updated' : 'created'}:`, data);
          router.push('/users');
        } else {
          const errorData = await response.json();
          console.error(`Failed to ${isEditMode ? 'update' : 'create'} user:`, errorData);

          // Show error message to the user
          setError(`Failed to ${isEditMode ? 'update' : 'create'} user: ${errorData.message || 'Unknown error'}`);

          // For demo purposes, we'll still redirect after a delay
          setTimeout(() => {
            console.log('Redirecting to users page anyway for demo purposes');
            router.push('/users');
          }, 3000);
        }
      } catch (err) {
        // If API call throws an exception, log it and show to user
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, err);
        setError(`Network error while ${isEditMode ? 'updating' : 'creating'} user. Please try again.`);

        // For demo purposes, we'll still redirect after a delay
        setTimeout(() => {
          console.log('Redirecting to users page anyway for demo purposes');
          router.push('/users');
        }, 3000);
      }
    } catch (err) {
      setError(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the user`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title={isEditMode ? "Edit User" : "Add User"}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{isEditMode ? "Edit User" : "Add New User"}</h1>
          <Link
            href="/users"
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password *
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
                Role *
              </Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_name}>
                        {role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1)}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="client_member">Client Member</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_email_verified}
                  onCheckedChange={handleStatusChange}
                  id="status"
                />
                <Label htmlFor="status">
                  {formData.is_email_verified ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Link
              href="/users"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update User' : 'Create User')
              }
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
