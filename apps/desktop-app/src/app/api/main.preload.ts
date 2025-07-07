import {
    DMA_DESKTOP_APP_API_NAMESPACE,
    DmaDesktopAppApi,
    DmaDesktopAppEvents,
    Locale,
    NotificationData,
    SeverityLevel,
    Translations,
} from '@dnd-mapp/desktop-shared';
import { contextBridge, ipcRenderer } from 'electron';

const desktopAppApi: DmaDesktopAppApi = {
    sendNotification: async (data: NotificationData) => {
        await ipcRenderer.invoke(DmaDesktopAppEvents.SEND_NOTIFICATION, data);
    },

    locale: async () => await ipcRenderer.invoke(DmaDesktopAppEvents.LOCALE),
    updateLocale: async (locale: Locale) => {
        await ipcRenderer.invoke(DmaDesktopAppEvents.UPDATE_LOCALE, locale);
    },

    translations: async () => await ipcRenderer.invoke(DmaDesktopAppEvents.TRANSLATIONS),
    onTranslationsUpdated: (listener: (translations: Translations) => void) => {
        ipcRenderer.on(DmaDesktopAppEvents.TRANSLATIONS_UPDATED, (_event, translations: Translations) => {
            listener(translations);
        });
        return () => ipcRenderer.removeAllListeners(DmaDesktopAppEvents.TRANSLATIONS_UPDATED);
    },

    logLevel: async () => await ipcRenderer.invoke(DmaDesktopAppEvents.LOG_LEVEL),
    updateLogLevel: async (logLevel: SeverityLevel) => {
        await ipcRenderer.invoke(DmaDesktopAppEvents.UPDATE_LOG_LEVEL, logLevel);
    },

    webSocketPort: async () => await ipcRenderer.invoke(DmaDesktopAppEvents.WEB_SOCKET_PORT),
    updateWebSocketPort: async (webSocketPort: number) => {
        await ipcRenderer.invoke(DmaDesktopAppEvents.UPDATE_WEB_SOCKET_PORT, webSocketPort);
    },
};

contextBridge.exposeInMainWorld(DMA_DESKTOP_APP_API_NAMESPACE, desktopAppApi);
