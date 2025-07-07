import { app } from 'electron';
import * as process from 'process';
import { environment } from '../environments';
import { ConfigService } from './config';
import { LogService } from './logging';
import { TranslationService } from './lokalisation';
import { NotificationService } from './notifications';
import { TrayService } from './tray';
import { ControllerManager } from './ui';
import { UpdateService } from './update';
import { WebSocketService } from './web-socket';

export class DmaDesktopApp {
    private static logService = LogService.withContext('DmaDesktopApp', true);
    private static controllerManager: ControllerManager;
    private static updateService: UpdateService;
    private static trayService: TrayService;
    private static notificationService: NotificationService;
    private static configService: ConfigService;
    private static translationService: TranslationService;
    private static webSocketService: WebSocketService;

    private static quited = false;

    /**
     * We pass the App and the BrowserWindow into this function so this class has no dependencies.
     * This makes the code easier to write tests for.
     */
    public static async bootstrapApp() {
        if (!app.requestSingleInstanceLock()) {
            app.quit();
        }

        // App is ready to load data
        app.on('ready', async () => {
            await this.logService.info(`Initializing DnD Mapp Desktop Application v${environment.version}`);
            await this.initializeServices();
        });

        // Ignore certificate errors in dev mode in order to connect to the UI app over HTTPS.
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

        app.on('window-all-closed', () => {
            // Do nothing on purpose to prevent the application from exiting.
        });

        process.on('uncaughtException', async (error) => {
            await this.logService.error(`Unhandled exception caught: ${error.message}`);
            console.error(error);
        });

        process.on('unhandledRejection', async (error) => {
            let message = 'Unhandled rejected promise caught';

            if (error instanceof Error) message += `: ${error.message}`;
            await this.logService.error(message);
            console.error(error);
        });
    }

    private static async onQuit() {
        if (this.quited) return;
        this.quited = true;

        await this.logService.info('Exiting application gracefully...');

        await this.destroyServices();
    }

    /**
     * Initialize services used in the application.
     *
     * NOTE: The order in which services initialize is important! Make sure that services that depend on other services
     * are initialized after those depending services have been initialized.
     * @private
     */
    private static async initializeServices() {
        await this.logService.info('Initializing services');

        await this.logService.initialize();
        this.configService = await ConfigService.instance();
        this.translationService = await TranslationService.instance();
        this.trayService = await TrayService.instance();
        this.updateService = await UpdateService.instance();
        this.notificationService = await NotificationService.instance();
        this.controllerManager = await ControllerManager.instance();
        this.webSocketService = await WebSocketService.instance();
    }

    /**
     * Destroy the services that are used in the application.
     *
     * NOTE: The order in which these services are destroyed is important! Services can only be destroyed once they're
     * no longer a dependency themselves.
     * @private
     */
    private static async destroyServices() {
        await this.logService.info('Destroying services');

        this.controllerManager = await this.controllerManager?.destroy();
        this.notificationService = await this.notificationService?.destroy();
        this.updateService = await this.updateService?.destroy();
        this.trayService = await this.trayService?.destroy();
        this.translationService = await this.translationService?.destroy();
        this.webSocketService = await this.webSocketService?.destroy();
        this.configService = await this.configService?.destroy();
        this.logService = await this.logService?.destroy();
    }
}
