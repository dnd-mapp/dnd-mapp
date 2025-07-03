import { app, autoUpdater, dialog, FeedURLOptions, MessageBoxOptions } from 'electron';
import { arch, platform } from 'process';
import { updateServerUrl } from '../constants';
import { DmaDesktopApp } from '../dma-desktop.app';

export class UpdateEvents {
    /** Initialize auto update service - must be invoked only in production */
    public static initAutoUpdateService() {
        const platformArch = platform === 'win32' ? platform : `${platform}_${arch}`;
        const version = app.getVersion();
        const feed: FeedURLOptions = { url: `${updateServerUrl}/update/${platformArch}/${version}` };

        if (!DmaDesktopApp.isDevelopmentMode()) {
            console.log('Initializing auto update service...\n');

            autoUpdater.setFeedURL(feed);
            this.checkForUpdates();
        }
    }

    /** Check for updates - must be invoked after initAutoUpdateService() and only in production */
    public static checkForUpdates() {
        if (DmaDesktopApp.isDevelopmentMode() || autoUpdater.getFeedURL() == '') return;
        autoUpdater.checkForUpdates();
    }
}

autoUpdater.on('update-downloaded', async (_event, releaseNotes, releaseName) => {
    const dialogOpts: MessageBoxOptions = {
        type: 'info' as const,
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.',
    };

    const returnValue = await dialog.showMessageBox(dialogOpts);
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
});

autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...\n');
});

autoUpdater.on('update-available', () => {
    console.log('New update available!\n');
});

autoUpdater.on('update-not-available', () => {
    console.log('Up to date!\n');
});

autoUpdater.on('before-quit-for-update', () => {
    console.log('Application update is about to begin...\n');
});

autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application');
    console.error(message, '\n');
});
