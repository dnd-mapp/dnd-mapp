import { dialog } from 'electron';
import { AppUpdater, autoUpdater, UpdateDownloadedEvent } from 'electron-updater';
import { AppUpdaterEvents } from 'electron-updater/out/AppUpdater';
import { platform } from 'process';
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

    private electronUpdater: AppUpdater;

    private readonly autoUpdaterEventListeners = {
        [ElectronUpdaterEventNames.ERROR]: (error: Error, message: string) => this.onUpdateError(message, error),
        [ElectronUpdaterEventNames.CHECKING_FOR_UPDATE]: () => this.onCheckingForUpdate(),
        [ElectronUpdaterEventNames.UPDATE_UNAVAILABLE]: () => this.onUpdateUnavailable(),
        [ElectronUpdaterEventNames.UPDATE_AVAILABLE]: () => this.onUpdateAvailable(),
        [ElectronUpdaterEventNames.UPDATE_DOWNLOADED]: async (event: UpdateDownloadedEvent) =>
            await this.onUpdateDownloaded(event),
    } as const;

    private constructor() {
        this.configureAutoUpdater();
        this.setupAutoUpdaterEventListeners();
    }

    public destroy(): null {
        this.removeAutoUpdaterEventListeners();

        UpdateService._instance = null;
        return null;
    }

    private async initialize() {
        if (isRunningInDevelopmentMode()) return;
        console.log('Initializing UpdateService...');

        await this.checkForUpdates();
    }

    private configureAutoUpdater() {
        this.electronUpdater = autoUpdater;

        this.electronUpdater.autoDownload = false;
        this.electronUpdater.autoInstallOnAppQuit = false;
        this.electronUpdater.fullChangelog = false;
    }

    private setupAutoUpdaterEventListeners() {
        Object.entries(this.autoUpdaterEventListeners).forEach(([eventName, listener]) => {
            this.electronUpdater.on(eventName as keyof AppUpdaterEvents, listener);
        });
    }

    private removeAutoUpdaterEventListeners() {
        Object.entries(this.autoUpdaterEventListeners).forEach(([eventName, listener]) => {
            this.electronUpdater.off(eventName as keyof AppUpdaterEvents, listener);
        });
    }

    private async checkForUpdates() {
        await this.electronUpdater.checkForUpdates();
    }

    private onUpdateError(message: string, error: Error) {
        console.error('There was a problem updating the application');
        console.error(message, error);
    }

    private onCheckingForUpdate() {
        console.log('Checking for updates...');
    }

    private onUpdateUnavailable() {
        console.log('Up to date!');
    }

    private onUpdateAvailable() {
        console.log('New update available!');
    }

    private async onUpdateDownloaded(updateDownloadedEvent: UpdateDownloadedEvent) {
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
