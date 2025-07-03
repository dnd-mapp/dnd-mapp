import { app, BrowserWindow, Event, screen, shell, WebContentsWillNavigateEventParams } from 'electron';
import { join } from 'path';
import * as process from 'process';
import { format } from 'url';
import { rendererAppName } from './constants';
import { UpdateService } from './update';

export class DmaDesktopApp {
    private static mainWindow: BrowserWindow;

    private static updateService: UpdateService;

    private static quited = false;

    /**
     * We pass the App and the BrowserWindow into this function so this class has no dependencies.
     * This makes the code easier to write tests for.
     */
    public static bootstrapApp() {
        // Quit when all windows are closed.
        app.on('window-all-closed', () => this.onWindowAllClosed());

        // App is ready to load data
        app.on('ready', async () => {
            await this.initializeServices();
            await this.onReady();
        });

        // App is activated
        app.on('activate', async () => await this.onActivate());

        app.on('certificate-error', (event, _webContents, url, _error, _certificate, callback) => {
            if (url.includes(`localhost.desktop-app.dnd-mapp.net`)) {
                event.preventDefault();
                callback(true);
                return;
            }
            callback(false);
        });

        app.on('quit', async () => await this.onQuit());
        app.on('will-quit', async () => await this.onQuit());
        app.on('before-quit', async () => await this.onQuit());

        process.on('uncaughtException', (error) => {
            console.error(error);
        });

        process.on('unhandledRejection', (error) => {
            console.error(error);
        });
    }

    private static async onWindowAllClosed() {
        if (process.platform === 'darwin') return;
        app.quit();
    }

    private static async onQuit() {
        if (this.quited) return;
        this.quited = true;

        await this.destroyServices();
    }

    private static onClose() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        this.mainWindow = null;
    }

    private static async onRedirect(event: Event<WebContentsWillNavigateEventParams>, url: string) {
        if (url !== this.mainWindow.webContents.getURL()) {
            // this is a normal external redirect, open it in a new browser window
            event.preventDefault();
            await shell.openExternal(url);
        }
    }

    private static async initializeServices() {
        this.updateService = await UpdateService.instance();
    }

    private static async destroyServices() {
        this.updateService = this.updateService.destroy();
    }

    /**
     * This method will be called when Electron has finished initialization and is ready to create browser windows.
     * Some APIs can only be used after this event occurs.
     */
    private static async onReady() {
        if (!rendererAppName) return;
        DmaDesktopApp.initializeMainWindow();
        await DmaDesktopApp.loadMainWindow();
    }

    /**
     * On macOS, it's common to re-create a window in the app when the
     * dock icon is clicked and there are no other windows open.
     */
    private static async onActivate() {
        if (DmaDesktopApp.mainWindow !== null) return;
        await DmaDesktopApp.onReady();
    }

    private static initializeMainWindow() {
        const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
        const width = Math.min(1280, workAreaSize.width || 1280);
        const height = Math.min(720, workAreaSize.height || 720);

        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            width: width,
            height: height,
            show: false,
            webPreferences: {
                preload: join(__dirname, 'main.preload.js'),
                sandbox: true,
            },
        });
        this.mainWindow.setMenu(null);
        this.mainWindow.center();

        // If the main window is ready to show, close the splash window and show the main window
        this.mainWindow.once('ready-to-show', () => this.mainWindow.show());

        // handle all external redirects in a new browser window
        this.mainWindow.webContents.on('will-navigate', async (event, url) => await this.onRedirect(event, url));

        // Emitted when the window is closed.
        this.mainWindow.on('closed', () => this.onClose());
    }

    private static async loadMainWindow() {
        // Load the index.html of the app.
        if (!app.isPackaged) {
            await this.mainWindow.loadURL(`https://localhost.desktop-app.dnd-mapp.net`);
        } else {
            await this.mainWindow.loadURL(
                format({
                    pathname: join(__dirname, '..', rendererAppName, 'browser', 'index.html'),
                    protocol: 'file:',
                    slashes: true,
                })
            );
        }
    }
}
