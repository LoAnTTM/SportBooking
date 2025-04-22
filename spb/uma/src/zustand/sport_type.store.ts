import { create } from 'zustand';

import sportTypeService from '@/services/sport_type.service';
import { SportTypeModel } from '@/types/model';
import { createSelectors } from '@/zustand/selectors';

interface SportTypeState {
  sportType: SportTypeModel[];
}

interface SportTypeActions {
  fetchSportTypes: () => Promise<void>;
}

const initialState: SportTypeState = {
  sportType: [],
};

const useSportTypeStoreBase = create<SportTypeState & SportTypeActions>(
  (set) => ({
    ...initialState,

    fetchSportTypes: async () => {
      const response = await sportTypeService.getSportTypes();
      if (response instanceof Error) throw response;

      const sportType = response.data.sportTypes;
      set({ sportType: sportType });
    },
  })
);

export const useSportTypeStore = createSelectors(useSportTypeStoreBase);
