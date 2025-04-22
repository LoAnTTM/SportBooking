import i18n from 'i18next';

import dataEn from '@/locales/en/data.json';
import dataVi from '@/locales/vi/data.json';

i18n.init({
  debug: true,
  fallbackLng: 'en',
  defaultNS: 'data',
  resources: {
    en: {
      data: dataEn,
    },
    vi: {
      data: dataVi,
    },
  },
});

export default i18n;
