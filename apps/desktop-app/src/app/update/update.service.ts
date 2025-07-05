import { tryCatch } from '@dnd-mapp/shared';
import { dialog } from 'electron';
import { AppUpdater, autoUpdater, UpdateDownloadedEvent } from 'electron-updater';
import { AppUpdaterEvents } from 'electron-updater/out/AppUpdater';
import { platform } from 'process';
import { LogService } from '../logging';
import { isRunningInDevelopmentMode } from '../utils';
import { ElectronUpdaterEventNames } from './constants';

export class UpdateService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new UpdateService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: UpdateService;

    private logService = LogService.withContext(UpdateService.name);
    private electronUpdater: AppUpdater;

    private readonly autoUpdaterEventListeners = {
        [ElectronUpdaterEventNames.ERROR]: async (_error: Error, message: string) => await this.onUpdateError(message),
        [ElectronUpdaterEventNames.CHECKING_FOR_UPDATE]: async () => await this.onCheckingForUpdate(),
        [ElectronUpdaterEventNames.UPDATE_UNAVAILABLE]: async () => await this.onUpdateUnavailable(),
        [ElectronUpdaterEventNames.UPDATE_AVAILABLE]: async () => await this.onUpdateAvailable(),
        [ElectronUpdaterEventNames.UPDATE_DOWNLOADED]: async (event: UpdateDownloadedEvent) =>
            await this.onUpdateDownloaded(event),
    } as const;

    private constructor() {}

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying UpdateService');
        await this.removeAutoUpdaterEventListeners();

        this.logService = await this.logService.destroy();
        UpdateService._instance = null;
        return null;
    }

    private async initialize() {
        await this.logService.info('Initializing UpdateService');

        if (isRunningInDevelopmentMode()) {
            await this.logService.warn('Updates are not available in development mode');
            return;
        }
        await this.configureAutoUpdater();
        await this.setupAutoUpdaterEventListeners();

        await this.checkForUpdates();
    }

    private async configureAutoUpdater() {
        await this.logService.debug('Configuring AutoUpdater');
        this.electronUpdater = autoUpdater;

        this.electronUpdater.autoDownload = false;
        this.electronUpdater.autoInstallOnAppQuit = false;
        this.electronUpdater.fullChangelog = false;
    }

    private async setupAutoUpdaterEventListeners() {
        await this.logService.debug('Setting up AutoUpdater event listeners');

        Object.entries(this.autoUpdaterEventListeners).forEach(([eventName, listener]) => {
            this.electronUpdater.on(eventName as keyof AppUpdaterEvents, listener);
        });
    }

    private async removeAutoUpdaterEventListeners() {
        if (!this.electronUpdater) return;
        await this.logService.debug('Removing AutoUpdater event listeners');

        Object.entries(this.autoUpdaterEventListeners).forEach(([eventName, listener]) => {
            this.electronUpdater.off(eventName as keyof AppUpdaterEvents, listener);
        });
    }

    private async checkForUpdates() {
        await this.logService.info('Checking if there are updates available');
        await tryCatch(this.electronUpdater.checkForUpdates());
    }

    private async onUpdateError(message: string) {
        await this.logService.warn(message);
    }

    private async onCheckingForUpdate() {
        await this.logService.debug('Checking for updates');
    }

    private async onUpdateUnavailable() {
        await this.logService.info('No updates available. The application is Up to date!');
    }

    private async onUpdateAvailable() {
        await this.logService.info('There are updates available!');
    }

    private async onUpdateDownloaded(updateDownloadedEvent: UpdateDownloadedEvent) {
        await this.logService.info('A new updates has been downloaded!');
        const { releaseNotes, releaseName } = updateDownloadedEvent;

        const returnValue = await dialog.showMessageBox({
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: platform === 'win32' ? (releaseNotes as string) : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.',
        });
        if (returnValue.response === 0) this.electronUpdater.quitAndInstall();
    }
}
