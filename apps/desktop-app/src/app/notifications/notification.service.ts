import { DmaDesktopAppEvents, NotificationData } from '@dnd-mapp/shared-desktop-app';
import { ipcMain, Notification } from 'electron';
import { LogService } from '../logging';
import { getIcon } from '../utils';

export class NotificationService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new NotificationService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: NotificationService;

    private logService = LogService.withContext('NotificationService');

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing NotificationService');
        await this.setupIpcHandlers();
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying NotificationService');
        await this.removeIpcListeners();

        this.logService = await this.logService.destroy();
        NotificationService._instance = null;
        return null;
    }

    private async setupIpcHandlers() {
        await this.logService.debug('Setting up IPC handlers for notifications');

        ipcMain.handle(
            DmaDesktopAppEvents.SEND_NOTIFICATION,
            async (_, data: NotificationData) => await this.onSendNotification(data)
        );
    }

    private async removeIpcListeners() {
        await this.logService.debug('Removing IPC handlers for notifications');

        ipcMain.removeHandler(DmaDesktopAppEvents.SEND_NOTIFICATION);
    }

    private async onSendNotification(data: NotificationData) {
        await this.logService.info('Sending notification');

        const { title, message, silent } = data;

        const notification = new Notification({
            icon: await getIcon(),
            title: title,
            body: message,
            silent: silent,
        });

        notification.show();

        // When clicking on the notification it'll be dismissed.
        // On Windows, this will also remove it from the action center.
        notification.on('click', async () => {
            notification.close();
            await this.logService.debug('Notification dismissed');
        });
    }
}
