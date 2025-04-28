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

interface UpdateClubForm {
  name?: string;
  phone?: string;
  description?: string;
  address?: {
    address?: string;
    ward_id?: string;
    location_geography?: {
      longitude: number;
      latitude: number;
    };
  };
}

export default function EditClubPage({ params }: { params: { id: string } }) {
  const [club, setClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState<UpdateClubForm>({
    name: '',
    phone: '',
    description: '',
    address: {
      address: '',
      ward_id: '',
      location_geography: {
        longitude: 0,
        latitude: 0,
      },
    },
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClubAndInitialData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch club details
        const clubResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!clubResponse.ok) {
          throw new Error('Failed to fetch club details');
        }

        const clubData = await clubResponse.json();
        const clubDetails = clubData.data;
        setClub(clubDetails);

        // Set form data from club details
        setFormData({
          name: clubDetails.name,
          phone: clubDetails.phone,
          description: clubDetails.description || '',
          address: {
            address: clubDetails.address?.address || '',
            ward_id: clubDetails.address?.ward_id || '',
            location_geography: {
              longitude: clubDetails.address?.location_geography?.longitude || 0,
              latitude: clubDetails.address?.location_geography?.latitude || 0,
            },
          },
        });

        // Fetch provinces
        const provincesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/provinces`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (provincesResponse.ok) {
          const provincesData = await provincesResponse.json();
          setProvinces(provincesData.data || []);
        }

        // If we have a ward_id, we need to fetch the district and province
        if (clubDetails.address?.ward_id) {
          // Fetch ward details to get district_id
          const wardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/wards/${clubDetails.address.ward_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (wardResponse.ok) {
            const wardData = await wardResponse.json();
            const districtId = wardData.data?.district_id;

            if (districtId) {
              setSelectedDistrict(districtId);

              // Fetch district details to get province_id
              const districtResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/districts/${districtId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (districtResponse.ok) {
                const districtData = await districtResponse.json();
                const provinceId = districtData.data?.province_id;

                if (provinceId) {
                  setSelectedProvince(provinceId);

                  // Fetch districts for this province
                  const districtsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/addresses/provinces/${provinceId}/districts`,
                    {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    }
                  );

                  if (districtsResponse.ok) {
                    const districtsData = await districtsResponse.json();
                    setDistricts(districtsData.data || []);
                  }

                  // Fetch wards for this district
                  const wardsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/addresses/districts/${districtId}/wards`,
                    {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    }
                  );

                  if (wardsResponse.ok) {
                    const wardsData = await wardsResponse.json();
                    setWards(wardsData.data || []);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        setError('Failed to load club details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClubAndInitialData();
    }
  }, [params.id, router]);

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
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof UpdateClubForm],
          [child]: value,
        },
      });
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

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        location_geography: {
          ...formData.address?.location_geography!,
          [name]: isNaN(numValue) ? 0 : numValue,
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/clubs/${params.id}`);
      } else {
        setError(data.message || 'Failed to update club');
      }
    } catch (err) {
      setError('An error occurred while updating the club');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Edit Club">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (error && !club) {
    return (
      <MainLayout title="Edit Club">
        <div className="container mx-auto px-4 py-6">
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <h2 className="mb-4 text-xl font-semibold text-red-600">Error</h2>
            <p className="text-red-500">{error}</p>
            <Link
              href="/clubs"
              className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Back to Clubs
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Edit Club: ${club?.name || ''}`}>
      <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Club: {club?.name}</h1>
        <Link
          href={`/clubs/${params.id}`}
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
              value={formData.address?.address}
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
                value={formData.address?.ward_id}
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
                value={formData.address?.location_geography?.longitude || 0}
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
                value={formData.address?.location_geography?.latitude || 0}
                onChange={handleLocationChange}
                step="0.000001"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Link
            href={`/clubs/${params.id}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
    </MainLayout>
  );
}
