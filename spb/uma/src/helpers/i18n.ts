import i18n from 'i18next';

import dataEn from '@/locales/en/data.json';
import profileEn from '@/locales/en/profile.json';
import dataVi from '@/locales/vi/data.json';
import profileVi from '@/locales/vi/profile.json';

i18n.init({
  debug: true,
  fallbackLng: 'en',
  defaultNS: 'data',
  resources: {
    en: {
      data: dataEn,
      profile: profileEn,
    },
    vi: {
      data: dataVi,
      profile: profileVi,
    },
  },
});

export default i18n;
