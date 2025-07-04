import { DmaDesktopAppEvents, NotificationData } from '@dnd-mapp/desktop-shared';
import { ipcMain, Notification } from 'electron';
import { getIcon } from '../utils';

export class NotificationService {
    public static instance() {
        if (this._instance) return this._instance;
        this._instance = new NotificationService();

        return this._instance;
    }
    private static _instance: NotificationService;

    private constructor() {
        this.setupIpcListeners();
    }

    public destroy(): null {
        this.removeIpcListeners();

        NotificationService._instance = null;
        return null;
    }

    private removeIpcListeners() {
        ipcMain.removeHandler(DmaDesktopAppEvents.SEND_NOTIFICATION);
    }

    private setupIpcListeners() {
        ipcMain.handle(
            DmaDesktopAppEvents.SEND_NOTIFICATION,
            async (_, data: NotificationData) => await this.onSendNotification(data)
        );
    }

    private async onSendNotification(data: NotificationData) {
        const { title, message } = data;

        const notification = new Notification({
            icon: await getIcon(),
            title: title,
            body: message,
        });

        notification.show();

        // When clicking on the notification it'll be dismissed.
        // On Windows, this will also remove it from the action center.
        notification.on('click', () => notification.close());
    }
}
