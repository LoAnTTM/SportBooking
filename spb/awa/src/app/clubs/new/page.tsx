'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';

interface Province {
  id: string;
  name: string;
  code: string;
}

interface District {
  id: string;
  name: string;
  code: string;
  province_id: string;
}

interface Ward {
  id: string;
  name: string;
  code: string;
  district_id: string;
}

interface SportType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  role_id: string;
  role_name: string;
  permissions: number;
}

interface User {
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  is_email_verified: boolean;
}

interface CreateClubForm {
  name: string;
  phone: string;
  owner_id: string;
  description: string;
  address: {
    address: string;
    ward_id: string;
    location_geography?: {
      longitude: number;
      latitude: number;
    };
  };
  media: {
    file_path: string;
    file_type: string;
    hash: string;
  }[];
  sport_types: string[];
}

// Function to get dummy users data as fallback
const getDummyUsers = (): User[] => {
  return [
    {
      user_id: '78574593-757c-49bc-aad1-3a8dd5c03970', // Default owner ID
      email: 'admin@gmail.com',
      full_name: 'Admin User',
      phone: '1234567890',
      role: {
        role_id: 'cc203bb9-7b33-4391-8917-0089588356f2',
        role_name: 'admin',
        permissions: 536870911
      },
      is_email_verified: true
    },
    {
      user_id: '6c8647dc-091f-4249-b9f7-12bed594d124',
      email: 'client@gmail.com',
      full_name: 'Client User',
      phone: '1234567891',
      role: {
        role_id: '6c8647dc-091f-4249-b9f7-12bed594d124',
        role_name: 'client',
        permissions: 83656277
      },
      is_email_verified: true
    },
    {
      user_id: '9666740a-4ff5-4d22-830f-ab3361ba5ef4',
      email: 'user@gmail.com',
      full_name: 'Regular User',
      phone: '1234567892',
      role: {
        role_id: '9666740a-4ff5-4d22-830f-ab3361ba5ef4',
        role_name: 'user',
        permissions: 79973893
      },
      is_email_verified: true
    }
  ];
};

export default function NewClubPage() {
  const [formData, setFormData] = useState<CreateClubForm>({
    name: '',
    phone: '',
    owner_id: '78574593-757c-49bc-aad1-3a8dd5c03970', // Default owner ID
    description: '',
    address: {
      address: '',
      ward_id: '',
      location_geography: {
        longitude: 0,
        latitude: 0,
      },
    },
    media: [],
    sport_types: [],
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch provinces
        try {
          const provincesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/provinces`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (provincesResponse.ok) {
            const provincesData = await provincesResponse.json();
            console.log('Provinces API Response:', provincesData);
            setProvinces(provincesData.data || []);
          } else {
            console.error('Failed to fetch provinces:', provincesResponse.status);
          }
        } catch (err) {
          console.error('Error fetching provinces:', err);
        }

        // Fetch sport types
        try {
          const sportTypesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sport-types`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (sportTypesResponse.ok) {
            const sportTypesData = await sportTypesResponse.json();
            console.log('Sport Types API Response:', sportTypesData);

            // Handle different response structures
            if (Array.isArray(sportTypesData)) {
              setSportTypes(sportTypesData);
            } else if (sportTypesData.data && Array.isArray(sportTypesData.data)) {
              setSportTypes(sportTypesData.data);
            } else if (sportTypesData.data && sportTypesData.data.items && Array.isArray(sportTypesData.data.items)) {
              setSportTypes(sportTypesData.data.items);
            } else {
              console.error('Unexpected sport types data structure:', sportTypesData);
              setSportTypes([]);
            }
          } else {
            console.error('Failed to fetch sport types:', sportTypesResponse.status);
            setSportTypes([]);
          }
        } catch (err) {
          console.error('Error fetching sport types:', err);
          setSportTypes([]);
        }

        // Fetch users with fallback to dummy data
        try {
          const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?i=100&p=1`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('Users API Response:', usersData);

            // Handle the specific response structure from the API
            if (usersData.data && Array.isArray(usersData.data.users)) {
              setUsers(usersData.data.users);
            } else if (Array.isArray(usersData)) {
              setUsers(usersData);
            } else if (usersData.data && Array.isArray(usersData.data)) {
              setUsers(usersData.data);
            } else if (usersData.data && usersData.data.items && Array.isArray(usersData.data.items)) {
              setUsers(usersData.data.items);
            } else {
              console.error('Unexpected users data structure, using fallback data');
              setUsers(getDummyUsers());
            }
          } else {
            console.error('Failed to fetch users, using fallback data');
            setUsers(getDummyUsers());
          }
        } catch (err) {
          console.error('Error fetching users, using fallback data:', err);
          setUsers(getDummyUsers());
        }
      } catch (err) {
        console.error('Error in fetchInitialData:', err);
      }
    };

    fetchInitialData();
  }, [router]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/provinces/${selectedProvince}/districts`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDistricts(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    };

    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) {
        setWards([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/districts/${selectedDistrict}/wards`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWards(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching wards:', err);
      }
    };

    fetchWards();
  }, [selectedDistrict]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      // Create a safe copy of the parent object
      const parentObj = formData[parent as keyof CreateClubForm];
      if (typeof parentObj === 'object' && parentObj !== null) {
        setFormData({
          ...formData,
          [parent]: {
            ...parentObj,
            [child]: value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        ward_id: '',
      },
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        ward_id: '',
      },
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        ward_id: wardId,
      },
    });
  };

  const handleSportTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData({
        ...formData,
        sport_types: [...formData.sport_types, value],
      });
    } else {
      setFormData({
        ...formData,
        sport_types: formData.sport_types.filter(id => id !== value),
      });
    }
  };

  const handleAddMedia = () => {
    if (!mediaUrl) return;

    // Simple hash generation for demo purposes
    const hash = Math.random().toString(36).substring(2, 15);
    const fileType = mediaUrl.split('.').pop() || 'jpg';

    setFormData({
      ...formData,
      media: [
        ...formData.media,
        {
          file_path: mediaUrl,
          file_type: fileType,
          hash: hash,
        },
      ],
    });

    setMediaUrl('');
  };

  const handleRemoveMedia = (index: number) => {
    const updatedMedia = [...formData.media];
    updatedMedia.splice(index, 1);

    setFormData({
      ...formData,
      media: updatedMedia,
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        location_geography: {
          ...formData.address.location_geography!,
          [name]: isNaN(numValue) ? 0 : numValue,
        },
      },
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

      // Log the API URL and request data for debugging
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/clubs`);
      console.log('Request Data:', formData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        // Handle different response structures
        const clubId = data.id || (data.data && data.data.id);
        if (clubId) {
          router.push(`/clubs/${clubId}`);
        } else {
          // If we can't get the ID, just go back to the clubs list
          router.push('/clubs');
        }
      } else {
        setError(data.message || 'Failed to create club');
      }
    } catch (err) {
      setError('An error occurred while creating the club');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Create New Club">
      <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Club</h1>
        <Link
          href="/clubs"
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
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Club Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="owner_id" className="mb-2 block text-sm font-medium text-gray-700">
            Owner *
          </label>
          <select
            id="owner_id"
            name="owner_id"
            value={formData.owner_id}
            onChange={handleInputChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="">Select an owner</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.full_name || user.email}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Default owner ID: 78574593-757c-49bc-aad1-3a8dd5c03970
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Address Information</h2>

          <div className="mb-4">
            <label htmlFor="address.address" className="mb-2 block text-sm font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              id="address.address"
              name="address.address"
              value={formData.address.address}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="province" className="mb-2 block text-sm font-medium text-gray-700">
                Province *
              </label>
              <select
                id="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="district" className="mb-2 block text-sm font-medium text-gray-700">
                District *
              </label>
              <select
                id="district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                required
                disabled={!selectedProvince}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a district</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ward" className="mb-2 block text-sm font-medium text-gray-700">
                Ward *
              </label>
              <select
                id="ward"
                name="address.ward_id"
                value={formData.address.ward_id}
                onChange={handleWardChange}
                required
                disabled={!selectedDistrict}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a ward</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="longitude" className="mb-2 block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.address.location_geography?.longitude || 0}
                onChange={handleLocationChange}
                step="0.000001"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="latitude" className="mb-2 block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.address.location_geography?.latitude || 0}
                onChange={handleLocationChange}
                step="0.000001"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Sport Types</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.isArray(sportTypes) && sportTypes.length > 0 ? (
              sportTypes.map((sport) => (
                <div key={sport.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`sport-${sport.id}`}
                    value={sport.id}
                    checked={formData.sport_types.includes(sport.id)}
                    onChange={handleSportTypeChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={`sport-${sport.id}`} className="ml-2 text-sm text-gray-700">
                    {sport.name}
                  </label>
                </div>
              ))
            ) : (
              <div className="col-span-full text-gray-500">No sport types available</div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Media</h2>

          <div className="mb-4 flex items-end gap-2">
            <div className="flex-grow">
              <label htmlFor="mediaUrl" className="mb-2 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="mediaUrl"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMedia}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          {formData.media.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {formData.media.map((media, index) => (
                <div key={index} className="relative rounded-lg border p-2">
                  <img
                    src={media.file_path}
                    alt="Club media"
                    className="h-32 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  <p className="mt-1 truncate text-xs text-gray-500">{media.file_path}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No media added yet.</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Link
            href="/clubs"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Creating...' : 'Create Club'}
          </button>
        </div>
      </form>
    </div>
    </MainLayout>
  );
}
