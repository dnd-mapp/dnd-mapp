import { NotificationData } from './data';
import { Locale, Translations } from './lokalisation';

export const DMA_DESKTOP_APP_API_NAMESPACE = 'dmaDesktopAppApi' as const;

export const DmaDesktopAppEvents = {
    SEND_NOTIFICATION: 'send-notification',

    LOCALE: 'locale',
    UPDATE_LOCALE: 'update-locale',
    LOCALE_CHANGE: 'locale-change',

    TRANSLATIONS: 'translations',
    TRANSLATIONS_UPDATED: 'translations-updated',
} as const;

type UnSubscriber = () => void;

export interface DmaDesktopAppApi {
    sendNotification(data: NotificationData): Promise<void>;

    locale(): Promise<Locale>;
    updateLocale(locale: Locale): Promise<void>;

    translations(): Promise<Translations>;
    onTranslationsUpdated(listener: (translations: Translations) => void): UnSubscriber;
}
