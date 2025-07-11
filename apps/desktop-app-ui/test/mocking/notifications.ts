import { NotificationData } from '@dnd-mapp/shared-desktop-app';

export let mockNotifications: NotificationData[] = [];

export function addNotification(data: NotificationData) {
    mockNotifications = [...mockNotifications, data];
}

export function resetNotifications() {
    mockNotifications = [];
}
