export const Locales = {
    EN_US: 'enUS',
    NL_NL: 'nlNL',
} as const;

export type Locale = (typeof Locales)[keyof typeof Locales];

export const DEFAULT_LOCALE = Locales.EN_US;
