import {
    DMA_DESKTOP_APP_API_NAMESPACE,
    DmaDesktopAppApi,
    DmaDesktopAppEvents,
    NotificationData,
} from '@dnd-mapp/desktop-shared';
import { contextBridge, ipcRenderer } from 'electron';

const desktopAppApi: DmaDesktopAppApi = {
    sendNotification: async (data: NotificationData) => {
        await ipcRenderer.invoke(DmaDesktopAppEvents.SEND_NOTIFICATION, data);
    },
};

contextBridge.exposeInMainWorld(DMA_DESKTOP_APP_API_NAMESPACE, desktopAppApi);
