import resources from '@/types/resources';

declare module 'i18next' {
  interface I18nTypeOptions {
    defaultNS: 'data';
    resources: {
      data: typeof resources;
    };
  }
}
