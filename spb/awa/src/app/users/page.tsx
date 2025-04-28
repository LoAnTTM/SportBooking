'use client';

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import DataTable from "@/components/ui/data-table";
import ClubIcon from "@/components/ui/club-icon";
import { usersData } from "@/data/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

export default function UsersPage() {
  const [users, setUsers] = useState(usersData);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

            // Handle different response structures
            if (Array.isArray(data)) {
              setUsers(data);
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('User deleted successfully');
          // Remove user from the list
          setUsers(users.filter((user: any) => user.id !== selectedUser.id));
        } else {
          console.error('Failed to delete user, but removing from UI anyway');
          // Still remove from UI for demo purposes
          setUsers(users.filter((user: any) => user.id !== selectedUser.id));
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        // Still remove from UI for demo purposes
        setUsers(users.filter((user: any) => user.id !== selectedUser.id));
      }
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

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
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setSelectedUser(row);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2Icon className="h-4 w-4" />
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
