import {
    DmaDesktopAppApi,
    Locale,
    NotificationData,
    SeverityLevel,
    Translations,
    UnSubscriber,
} from '@dnd-mapp/shared-desktop-app';
import { getLoggingLevel, resetLogLevel, setLogLevel } from './logging';
import {
    getMockLocale,
    getTranslations,
    resetLocale,
    setMockLocale,
    setTranslationsUpdatedHandler,
} from './lokalisation';
import { addNotification, resetNotifications } from './notifications';
import { getWebSocketPort, resetWebSocketPort, setWebSocketPort } from './web-socket';

export class MockDesktopAppApi implements DmaDesktopAppApi {
    public async sendNotification(data: NotificationData) {
        addNotification(data);
    }

    public async locale() {
        return getMockLocale();
    }

    public async updateLocale(locale: Locale) {
        setMockLocale(locale);
    }

    public async translations() {
        return await getTranslations();
    }

    public onTranslationsUpdated(listener: (translations: Translations) => void): UnSubscriber {
        return setTranslationsUpdatedHandler(listener);
    }

    public async logLevel() {
        return getLoggingLevel();
    }

    public async updateLogLevel(logLevel: SeverityLevel) {
        setLogLevel(logLevel);
    }

    public async webSocketPort() {
        return getWebSocketPort();
    }

    public async updateWebSocketPort(webSocketPort: number) {
        setWebSocketPort(webSocketPort);
    }

    public reset() {
        resetNotifications();
        resetLocale();
        resetLogLevel();
        resetWebSocketPort();
    }
}

export const mockDesktopAppApi = new MockDesktopAppApi();
