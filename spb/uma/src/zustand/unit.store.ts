import { create } from 'zustand';

import { UnitModel } from '@/types/model';
import { createSelectors } from '@/zustand/selectors';

interface UnitState {
  popularUnits: UnitModel[];
  nerdUnits: UnitModel[];
}

interface UnitActions {
  setPopularUnits: (units: UnitModel[]) => void;
  setNerdUnits: (units: UnitModel[]) => void;
}

const useUnitStoreBase = create<UnitState & UnitActions>((set) => ({
  popularUnits: [],
  nerdUnits: [],

  setPopularUnits: (units) => set({ popularUnits: units }),
  setNerdUnits: (units) => set({ nerdUnits: units }),
}));

export const useUnitStore = createSelectors(useUnitStoreBase);
