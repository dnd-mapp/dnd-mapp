import { NotificationData } from './data';

export const DMA_DESKTOP_APP_API_NAMESPACE = 'dmaDesktopAppApi' as const;

export const DmaDesktopAppEvents = {
    SEND_NOTIFICATION: 'send-notification',
} as const;

export interface DmaDesktopAppApi {
    sendNotification(data: NotificationData): Promise<void>;
}
