export const Locales = {
    EN_US: 'en-US',
} as const;

export type Locale = (typeof Locales)[keyof typeof Locales];

export const DEFAULT_LOCALE: Locale = Locales.EN_US;
