import { NotificationData } from './data';
import { SeverityLevel } from './logging';
import { Locale, Translations } from './lokalisation';

export const DMA_DESKTOP_APP_API_NAMESPACE = 'dmaDesktopAppApi' as const;

export const DmaDesktopAppEvents = {
    SEND_NOTIFICATION: 'send-notification',

    LOCALE: 'locale',
    UPDATE_LOCALE: 'update-locale',

    TRANSLATIONS: 'translations',
    TRANSLATIONS_UPDATED: 'translations-updated',

    LOG_LEVEL: 'log-level',
    UPDATE_LOG_LEVEL: 'update-log-level',
} as const;

type UnSubscriber = () => void;

export interface DmaDesktopAppApi {
    sendNotification(data: NotificationData): Promise<void>;

    locale(): Promise<Locale>;
    updateLocale(locale: Locale): Promise<void>;

    translations(): Promise<Translations>;
    onTranslationsUpdated(listener: (translations: Translations) => void): UnSubscriber;

    logLevel(): Promise<SeverityLevel>;
    updateLogLevel(logLevel: SeverityLevel): Promise<void>;
}
