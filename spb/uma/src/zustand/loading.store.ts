import { create } from 'zustand';

import { createSelectors } from '@/zustand/selectors';

interface LoadingState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useLoadingStoreBase = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (isLoading: LoadingState['isLoading']) =>
    set(() => ({ isLoading })),
}));

export const useLoadingStore = createSelectors(useLoadingStoreBase);
