import { NotificationData } from '@dnd-mapp/desktop-shared';

export let mockNotifications: NotificationData[] = [];

export function addNotification(data: NotificationData) {
    mockNotifications = [...mockNotifications, data];
}

export function resetNotifications() {
    mockNotifications = [];
}
