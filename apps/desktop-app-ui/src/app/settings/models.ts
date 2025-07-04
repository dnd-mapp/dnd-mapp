import { Locale, Locales } from '@dnd-mapp/desktop-shared';

interface LocaleOptions {
    label: string;
    value: Locale;
}

export const localeOptions: LocaleOptions[] = [
    { label: 'English', value: Locales.EN_US },
    { label: 'Nederlands', value: Locales.NL_NL },
] as const;
