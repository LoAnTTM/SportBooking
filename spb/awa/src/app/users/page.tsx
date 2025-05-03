'use client';

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import DataTable from "@/components/ui/data-table";
import ClubIcon from "@/components/ui/club-icon";
import { usersData } from "@/data/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export default function UsersPage() {
  const [users, setUsers] = useState(usersData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?i=100&p=1`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Users API response:', data);

            // Handle the specific response structure from the API
            if (data.data && Array.isArray(data.data.users)) {
              // Transform the API response to match our UI structure
              const transformedUsers = data.data.users.map((user: any) => ({
                id: user.user_id,
                name: user.full_name || user.email.split('@')[0], // Use full_name if available, otherwise use email username
                email: user.email,
                type: user.role.role_name === 'admin' ? 'product' :
                      user.role.role_name === 'client' ? 'website' : 'icon',
                dateAdded: new Date().toLocaleDateString(), // API doesn't provide this, using current date
                role: user.role.role_name.charAt(0).toUpperCase() + user.role.role_name.slice(1), // Capitalize role name
                status: user.is_email_verified ? "Active" : "Inactive",
                lastLogin: "Recently", // API doesn't provide this
                roleId: user.role.role_id,
                permissions: user.role.permissions
              }));
              setUsers(transformedUsers);
            } else if (data.data && Array.isArray(data.data)) {
              setUsers(data.data);
            } else if (data.data && data.data.items && Array.isArray(data.data.items)) {
              setUsers(data.data.items);
            } else {
              console.error('Unexpected users data structure, using fallback data');
              setUsers(usersData);
            }
          } else {
            console.error('Failed to fetch users, using fallback data');
            setUsers(usersData);
          }
        } catch (err) {
          console.error('Error fetching users, using fallback data:', err);
          setUsers(usersData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);



  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (row: any) => (
        <div className="flex items-center">
          <ClubIcon type={row.type as any} className="mr-3" />
          <div>
            <div>{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Date Added",
      accessor: "dateAdded",
    },
    {
      header: "Role",
      accessor: "role",
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row: any) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
          row.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row.status}
        </div>
      ),
    },
    {
      header: "Last Login",
      accessor: "lastLogin",
    },
    {
      header: "",
      accessor: "actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/users/${row.id}`}>
              <span className="text-sm">View</span>
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Users" showSearch>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex space-x-2">
          <Link href="/users/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {loading && !users.length ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading users...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable data={users} columns={columns} />
        </div>
      )}
    </MainLayout>
  );
}
