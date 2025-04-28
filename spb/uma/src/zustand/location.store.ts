import Geolocation from 'react-native-geolocation-service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { GEOGRAPHY_RADIUS } from '@/constants';
import { logError } from '@/helpers/logger';
import { getData, storeData } from '@/helpers/storage';
import { getPosition, reverseGeocode } from '@/hooks/useLocationTracking';
import locationService from '@/services/location.service';
import { District, Province, Ward } from '@/services/types';

interface LocationState {
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  radius: number;
  province: Province[];
  district: District[];
  ward: Ward[];
  isLoading: boolean;
}

interface LocationActions {
  setLocation: (lat: number, lng: number) => void;
  setAddress: (addr: string, city: string) => Promise<void>;
  loadPreviousAddress: () => Promise<void>;
  updateAddress: () => Promise<void>;
  getCurrentLocation: () => Promise<{ longitude: number; latitude: number }>;
  getProvince: () => Promise<Province[]>;
  getDistrict: (provinceId: string) => Promise<District[]>;
  getWard: (districtId: string) => Promise<Ward[]>;
  reset: () => void;
}

const initialState: LocationState = {
  latitude: 0,
  longitude: 0,
  address: null,
  city: null,
  radius: GEOGRAPHY_RADIUS,
  province: [],
  district: [],
  ward: [],
  isLoading: false,
};

export const useLocationStore = create<LocationState & LocationActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setLocation: (lat, lng) => {
        set({ latitude: lat, longitude: lng });
      },

      setAddress: async (addr, city) => {
        await storeData(
          'address',
          JSON.stringify({
            address: addr,
            city: city,
          })
        );

        set({ address: addr, city: city });
      },

      loadPreviousAddress: async () => {
        const data = await getData('address');
        if (data) {
          const { address, city } = JSON.parse(data);
          set({ address, city });
        }
      },

      updateAddress: async (): Promise<void> => {
        try {
          const { latitude, longitude } = await getPosition();
          const { address, city } = await reverseGeocode(latitude, longitude);

          set({ latitude, longitude, address, city });
        } catch (error) {
          logError(error as Error, 'Error getting location:');
        }
      },

      getCurrentLocation: (): Promise<{
        longitude: number;
        latitude: number;
      }> => {
        let latitude = get().latitude;
        let longitude = get().longitude;

        if (latitude && longitude) {
          return Promise.resolve({ latitude, longitude });
        }

        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            (position) => {
              longitude = position.coords.longitude;
              latitude = position.coords.latitude;
              set({ latitude, longitude });
              resolve({ latitude, longitude });
            },
            (error) => {
              console.error('Error getting location:', error);
              reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        });
      },

      getProvince: async (): Promise<Province[]> => {
        if (get().province.length > 0) {
          return get().province;
        }

        set({ isLoading: true });
        const response = await locationService.fetchProvince();
        if (response instanceof Error) {
          throw response;
        }

        set({ province: response.data, isLoading: false });
        return response.data;
      },

      getDistrict: async (provinceId: string): Promise<District[]> => {
        //   check if have district wih provinceId
        const districts = get().district.filter(
          (district) => district.provinceId === provinceId
        );
        if (districts.length > 0) {
          return districts;
        }

        set({ isLoading: true });
        const response = await locationService.fetchDistrict(provinceId);
        if (response instanceof Error) {
          throw response;
        }
        const data = response.data;
        //   set district with provinceId
        const district = data.map((item) => {
          return { ...item, provinceId: provinceId };
        });
        set({ district: district, isLoading: false });
        return district;
      },

      getWard: async (districtId: string) => {
        //   check if have district wih districtId
        const wards = get().ward.filter(
          (ward) => ward.districtId === districtId
        );
        if (wards.length > 0) {
          return wards;
        }

        set({ isLoading: true });
        const response = await locationService.fetchWard(districtId);
        if (response instanceof Error) {
          throw response;
        }
        const data = response.data;
        //   set ward with districtId
        const ward = data.map((item) => {
          return { ...item, districtId: districtId };
        });
        set({ ward: ward, isLoading: false });
        return ward;
      },

      reset: () => {
        set({ ...initialState, province: [], district: [], ward: [] });
      },
    }),
    { name: 'LocationStore' }
  )
);
