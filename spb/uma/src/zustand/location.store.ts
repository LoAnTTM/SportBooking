import { create } from 'zustand';

import { getData, storeData } from '@/helpers/storage';
import { createSelectors } from '@/zustand/selectors';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
}

interface LocationActions {
  setLocation: (lat: number, lng: number) => void;
  setAddress: (addr: string, city: string) => Promise<void>;
  loadPreviousAddress: () => Promise<void>;
}

const useLocationStoreBase = create<LocationState & LocationActions>((set) => ({
  latitude: null,
  longitude: null,
  address: null,
  city: null,

  setLocation: (lat, lon) => {
    // store address and city
    set({ latitude: lat, longitude: lon });
  },
  setAddress: async (addr, city) => {
    // store address and city
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
}));

export const useLocationStore = createSelectors(useLocationStoreBase);
