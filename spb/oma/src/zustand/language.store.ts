import { create } from 'zustand';

import i18n from '@/helpers/i18n';
import { getData, storeData } from '@/helpers/storage';
import { createSelectors } from '@/zustand/selectors';

interface LanguageState {
  currentLanguage: string;
  isLoading: boolean;
}

interface LanguageActions {
  setLanguage: (lang: string) => Promise<void>;
  initializeLanguage: () => Promise<void>;
}

const LANGUAGE_STORAGE_KEY = 'app_language';

const initialState: LanguageState = {
  currentLanguage: i18n.language || 'en',
  isLoading: false,
};

const useLanguageStoreBase = create<LanguageState & LanguageActions>((set) => ({
  ...initialState,

  setLanguage: async (lang: string) => {
    try {
      set({ isLoading: true });
      await i18n.changeLanguage(lang);
      await storeData(LANGUAGE_STORAGE_KEY, lang);
      set({ currentLanguage: lang, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  initializeLanguage: async () => {
    try {
      set({ isLoading: true });
      const savedLanguage = await getData(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
        set({ currentLanguage: savedLanguage });
      } else {
        set({ currentLanguage: i18n.language || 'en' });
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useLanguageStore = createSelectors(useLanguageStoreBase);
