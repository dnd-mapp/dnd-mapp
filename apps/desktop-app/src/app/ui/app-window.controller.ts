import { app, BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { format } from 'url';
import { LogService } from '../logging';
import { TrayService } from '../tray';
import { getIcon } from '../utils';
import { ControllerManager } from './controller-manager';
import { WindowController } from './models';

export class AppWindowController implements WindowController {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new AppWindowController();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: AppWindowController;

    private trayService: TrayService;
    private controllerManager: ControllerManager;
    private loggingService = LogService.withContext('AppWindowController');

    private window: BrowserWindow;

    private showingDevTools = false;

    private async initialize() {
        await this.loggingService.info('Initializing AppWindowController');
        this.trayService = await TrayService.instance();
        this.controllerManager = await ControllerManager.instance();

        await this.initializeWindow();
    }

    public async destroy() {
        await this.loggingService.info('Destroying AppWindowController');

        if (this.window) {
            this.window.close();
            this.window = null;
        }
        AppWindowController._instance = null;
    }

    public async showWindow() {
        await this.loggingService.debug(`Loading window contents`);

        // Load the index.html of the app.
        if (!app.isPackaged) {
            await this.window.loadURL(`https://localhost.desktop-app.dnd-mapp.net`);
        } else {
            await this.window.loadURL(
                format({
                    pathname: join(__dirname, '..', 'desktop-app-ui', 'browser', 'index.html'),
                    protocol: 'file:',
                    slashes: true,
                })
            );
        }
    }

    public async sendIpcMessage(channel: string, ...args: unknown[]) {
        await this.loggingService.info(`Sending IPC message "${channel}" to main app window`);
        this.window?.webContents.send(channel, ...args);
    }

    public devToolsShown() {
        return this.showingDevTools;
    }

    public async toggleDevTools() {
        await this.loggingService.debug('DevTools have been toggled');
        this.showingDevTools = !this.showingDevTools;

        if (this.showingDevTools) {
            this.window.webContents.openDevTools({ mode: 'detach' });
        } else {
            this.window.webContents.closeDevTools();
        }
        await this.trayService.configureContextMenu();
    }

    private async initializeWindow() {
        await this.loggingService.info('Initializing main app window');

        const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
        const width = Math.min(1280, workAreaSize.width || 1280);
        const height = Math.min(720, workAreaSize.height || 720);

        // Create the browser window.
        this.window = new BrowserWindow({
            width: width,
            height: height,
            show: false,
            icon: await getIcon(),
            webPreferences: {
                preload: join(__dirname, 'main.preload.js'),
                sandbox: true,
            },
        });
        this.window.setMenu(null);
        this.window.center();

        // If the window is ready to show, close the splash window and show the window
        this.window.once('ready-to-show', async () => await this.onReadyToShow());

        // Emitted when the window is closed.
        this.window.on('closed', async () => await this.onClose());

        this.window.webContents.on('devtools-closed', async () => await this.onDevtoolsClosed());
    }

    private async onReadyToShow() {
        await this.loggingService.info('Showing main app window');
        this.window.show();
    }

    private async onClose() {
        await this.loggingService.info('Main app window has been closed');

        this.window = null;
        await this.controllerManager.removeController(this);
        await this.trayService.configureContextMenu();
    }

    private async onDevtoolsClosed() {
        await this.loggingService.info('DevTools window has been closed');
        this.showingDevTools = false;
    }
}
