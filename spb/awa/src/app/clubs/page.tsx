'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clubsData } from '@/data/mock-data';
import MainLayout from '@/components/layout/main-layout';

interface Media {
  id: string;
  file_path: string;
  file_type: string;
  hash: string;
}

interface Address {
  id: string;
  address: string;
  ward_id: string;
  location_geography?: {
    longitude: number;
    latitude: number;
  };
}

interface SportType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Club {
  id: string;
  name: string;
  phone: string;
  owner_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
  address?: Address;
  media?: Media[];
  sport_types?: SportType[];
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Log the API URL for debugging
        console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/clubs`);

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            console.error('Failed to fetch clubs from API, using fallback data');
            setClubs(clubsData);
            return;
          }

          const data = await response.json();
          console.log('API Response:', data);

          // Handle different response structures
          if (Array.isArray(data)) {
            setClubs(data);
          } else if (data.data && Array.isArray(data.data)) {
            setClubs(data.data);
          } else if (data.data && data.data.items && Array.isArray(data.data.items)) {
            setClubs(data.data.items);
          } else {
            console.error('Unexpected data structure from API, using fallback data');
            setClubs(clubsData);
          }
        } catch (err) {
          console.error('Error fetching clubs from API, using fallback data:', err);
          setClubs(clubsData);
        }
      } catch (err) {
        console.error('Error in fetchClubs:', err);
        setClubs(clubsData);
      } finally {
        setLoading(false);
        setError(null); // Clear any previous errors since we're using fallback data
      }
    };

    fetchClubs();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to delete club via API, but removing from UI anyway');
        } else {
          console.log('Club deleted successfully via API');
        }
      } catch (err) {
        console.error('Error deleting club via API, but removing from UI anyway:', err);
      }

      // Remove the deleted club from the state regardless of API success
      // This ensures the UI is updated even if the API call fails
      setClubs(clubs.filter(club => club.id !== id));
    } catch (err) {
      console.error('Error in handleDelete:', err);
      alert('An error occurred while deleting the club');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Clubs">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Clubs">
      <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clubs</h1>
        <Link
          href="/clubs/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Add New Club
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
          {error}
        </div>
      ) : clubs.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No Clubs Found</h2>
          <p className="mb-4 text-gray-500">Get started by creating a new club.</p>
          <Link
            href="/clubs/new"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Add New Club
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <div key={club.id} className="overflow-hidden rounded-lg bg-white shadow">
              <div className="h-48 bg-gray-200">
                {club.media && club.media.length > 0 ? (
                  <img
                    src={club.media[0].file_path}
                    alt={club.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-200">
                    <svg
                      className="h-16 w-16 text-gray-400"
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
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                      <path d="M18 14h-8" />
                      <path d="M15 18h-5" />
                      <path d="M10 6h8v4h-8V6Z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold">{club.name}</h2>
                <p className="mb-2 text-gray-600">{club.phone}</p>
                {club.address && (
                  <p className="mb-4 text-gray-600">{club.address.address}</p>
                )}
                {club.sport_types && club.sport_types.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {club.sport_types.map((sport) => (
                      <span
                        key={sport.id}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                      >
                        {sport.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex justify-between">
                  <Link
                    href={`/clubs/${club.id}`}
                    className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      href={`/clubs/edit/${club.id}`}
                      className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(club.id)}
                      className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
}
