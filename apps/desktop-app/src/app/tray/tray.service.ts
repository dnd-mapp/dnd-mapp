import { app, Menu, Tray } from 'electron';
import { Subject } from 'rxjs';
import { LogService } from '../logging';
import { TranslationService } from '../lokalisation';
import { ControllerManager } from '../ui';
import { AppWindowController } from '../ui/app-window.controller';
import { getIcon, isRunningInDevelopmentMode } from '../utils';

export class TrayService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new TrayService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: TrayService;

    private logService = LogService.withContext('TrayService');
    private translationService: TranslationService;
    private controllerManager: ControllerManager;
    private tray: Tray;

    private readonly destroy$ = new Subject<void>();

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing TrayService');
        this.translationService = await TranslationService.instance();
        this.controllerManager = await ControllerManager.instance();

        await this.configureTray();
        await this.configureContextMenu();

        this.translationService.translationsUpdated$.pipe().subscribe({
            next: async () => await this.configureContextMenu(),
        });
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying TrayService');
        this.destroy$.next();
        this.destroy$.complete();

        this.tray.destroy();

        this.logService = await this.logService.destroy();
        TrayService._instance = null;
        return null;
    }

    public async configureContextMenu() {
        if (this.tray.isDestroyed()) return;
        await this.logService.debug('Configuring the Context menu of the Tray icon');

        const {
            APP_NAME,
            TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS,
            TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS,
            TRAY_MENU_BUTTON_LABEL_QUIT,
        } = this.translationService.getTranslations();

        const appWindowController = await this.controllerManager.getController(AppWindowController);

        const menu = Menu.buildFromTemplate([
            {
                label: APP_NAME,
                icon: (await getIcon()).resize({ height: 16, width: 16, quality: 'best' }),
                enabled: false,
            },
            { type: 'separator' },
            {
                label:
                    (appWindowController?.devToolsShown() ?? false)
                        ? TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS
                        : TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS,
                visible: isRunningInDevelopmentMode(),
                enabled: appWindowController !== null,
                click: async () => await this.onToggleDevTools(),
            },
            { type: 'separator' },
            { label: TRAY_MENU_BUTTON_LABEL_QUIT, role: 'quit', click: async () => await this.onCloseApplication() },
        ]);

        this.tray.setContextMenu(menu);
    }

    private async configureTray() {
        await this.logService.debug('Configuring the Tray icon');

        this.tray = new Tray(await getIcon());
        this.tray.setToolTip(await this.translationService.getTranslation('APP_NAME'));

        this.tray.on('click', async () => await this.onTrayClicked());
    }

    private async onCloseApplication() {
        await this.logService.info('Closing application via the Tray Context menu');
        app.quit();
    }

    private async onToggleDevTools() {
        const appWindowController = await this.controllerManager.getController(AppWindowController);

        if (!appWindowController) return;
        await appWindowController.toggleDevTools();
    }

    private async onTrayClicked() {
        if (!(await this.controllerManager.openAppWindow())) return;
        await this.logService.info('Tray icon clicked');

        await this.configureContextMenu();
    }
}
