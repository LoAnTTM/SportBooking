import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';

interface UnitPrice {
  id: string;
  price: number;
  currency: string;
  start_time: string;
  end_time: string;
  unit_id: string;
  created_at: string;
  updated_at: string;
}

interface UnitService {
  id: string;
  name: string;
  icon: string;
  price: number;
  currency: string;
  description: string;
  status: number;
  unit_id: string;
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

interface SportType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Unit {
  id: string;
  name: string;
  open_time: string;
  close_time: string;
  phone: string;
  description?: string;
  status: number;
  club_id: string;
  created_at: string;
  updated_at: string;
  address?: Address;
  media?: Media[];
  sport_types?: SportType[];
  unit_prices?: UnitPrice[];
  unit_services?: UnitService[];
}

interface BookedTime {
  start_time: string;
  end_time: string;
  booking_day: string;
}

const UnitDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [bookedTimes, setBookedTimes] = useState<BookedTime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('details');

  useEffect(() => {
    const fetchUnitDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch unit details');
        }

        const data = await response.json();
        setUnit(data.data);
      } catch (err) {
        setError('Failed to load unit details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUnitDetails();
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!id || !selectedDate) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units/${id}/booked-time`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ booked_day: selectedDate }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booked times');
        }

        const data = await response.json();
        setBookedTimes(data.data || []);
      } catch (err) {
        console.error('Error fetching booked times:', err);
      }
    };

    fetchBookedTimes();
  }, [id, selectedDate, navigate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Format "HH:MM" from "HH:MM:SS"
  };

  const formatCurrency = (price: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }
    return `${price} ${currency}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !unit) {
    return (
      <DashboardLayout>
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-600">Error</h2>
          <p className="text-red-500">{error || 'Unit not found'}</p>
          <button
            onClick={() => navigate('/units')}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Back to Units
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{unit.name}</h1>
          <button
            onClick={() => navigate('/units')}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back to Units
          </button>
        </div>

        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('details')}
                className={`w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'details'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'pricing'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'services'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'availability'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Availability
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div>
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h2 className="mb-4 text-lg font-semibold">Unit Information</h2>
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Status:</span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          unit.status === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {unit.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span>{unit.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Hours:</span>
                        <span>{formatTime(unit.open_time)} - {formatTime(unit.close_time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Created:</span>
                        <span>{new Date(unit.created_at).toLocaleDateString()}</span>
                      </div>
                      {unit.address && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">Address:</span>
                          <span>{unit.address.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-4 text-lg font-semibold">Description</h2>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-gray-700">{unit.description || 'No description available.'}</p>
                    </div>
                  </div>
                </div>

                {unit.media && unit.media.length > 0 && (
                  <div className="mt-6">
                    <h2 className="mb-4 text-lg font-semibold">Photos</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {unit.media.map((media) => (
                        <div key={media.id} className="overflow-hidden rounded-lg">
                          <img
                            src={media.file_path}
                            alt={unit.name}
                            className="h-48 w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {unit.sport_types && unit.sport_types.length > 0 && (
                  <div className="mt-6">
                    <h2 className="mb-4 text-lg font-semibold">Sport Types</h2>
                    <div className="flex flex-wrap gap-2">
                      {unit.sport_types.map((sport) => (
                        <span
                          key={sport.id}
                          className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                        >
                          {sport.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Pricing Information</h2>
                {unit.unit_prices && unit.unit_prices.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Time Slot
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {unit.unit_prices.map((price) => (
                          <tr key={price.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {formatTime(price.start_time)} - {formatTime(price.end_time)}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {formatCurrency(price.price, price.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No pricing information available.</p>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Available Services</h2>
                {unit.unit_services && unit.unit_services.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {unit.unit_services.map((service) => (
                      <div key={service.id} className="overflow-hidden rounded-lg border bg-white shadow">
                        <div className="p-4">
                          <div className="mb-2 flex items-center">
                            {service.icon && (
                              <img
                                src={service.icon}
                                alt={service.name}
                                className="mr-2 h-6 w-6"
                              />
                            )}
                            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                          </div>
                          <p className="mb-2 text-sm text-gray-500">{service.description}</p>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(service.price, service.currency)}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              service.status === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.status === 1 ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No services available.</p>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Check Availability</h2>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <h3 className="mb-2 text-md font-medium">Booked Time Slots</h3>
                {bookedTimes.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Start Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            End Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {bookedTimes.map((slot, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {formatTime(slot.start_time)}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {formatTime(slot.end_time)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-lg bg-green-50 p-4 text-green-700">
                    No bookings for this date. The unit is fully available.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UnitDetails;
