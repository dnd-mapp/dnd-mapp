import { Locale, Locales, Translations } from '@dnd-mapp/desktop-shared';

let mockedLocale: Locale = Locales.EN_US;

let translationsUpdatedHandler: (translations: Translations) => void;

export function getMockLocale() {
    return mockedLocale;
}

export function setMockLocale(locale: Locale) {
    mockedLocale = locale;
}

export function resetLocale() {
    mockedLocale = Locales.EN_US;
    removeTranslationsUpdatedHandler();
}

export async function getTranslations(): Promise<Translations> {
    const response = await fetch(`localisation/${mockedLocale}.json`);

    return await response.json();
}

export function setTranslationsUpdatedHandler(handler: (translations: Translations) => void) {
    translationsUpdatedHandler = handler;
    return () => removeTranslationsUpdatedHandler();
}

export function removeTranslationsUpdatedHandler() {
    translationsUpdatedHandler = null;
}

export async function triggerTranslationsUpdatedHandler() {
    const translations = await getTranslations();
    translationsUpdatedHandler(translations);
}
