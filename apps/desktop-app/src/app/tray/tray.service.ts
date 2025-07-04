import { app, Menu, Tray } from 'electron';
import { Subject } from 'rxjs';
import { DmaDesktopApp } from '../dma-desktop.app';
import { TranslationService } from '../lokalisation';
import { getIcon } from '../utils';

export class TrayService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new TrayService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: TrayService;

    private translationService: TranslationService;
    private tray: Tray;

    private readonly destroy$ = new Subject<void>();

    private constructor() {}

    private async initialize() {
        this.translationService = await TranslationService.instance();

        await this.configureTray();
        await this.configureContextMenu();

        this.translationService.translationsUpdated$.pipe().subscribe({
            next: async () => await this.configureContextMenu(),
        });
    }

    public destroy(): null {
        this.destroy$.next();
        this.destroy$.complete();

        this.tray.destroy();

        TrayService._instance = null;
        return null;
    }

    public async configureContextMenu() {
        const {
            APP_NAME,
            TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS,
            TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS,
            TRAY_MENU_BUTTON_LABEL_QUIT,
        } = this.translationService.getTranslations();

        const menu = Menu.buildFromTemplate([
            {
                label: APP_NAME,
                icon: (await getIcon()).resize({ height: 16, width: 16, quality: 'best' }),
                enabled: false,
            },
            { type: 'separator' },
            {
                label: DmaDesktopApp.devToolsShown()
                    ? TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS
                    : TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS,
                click: () => this.onToggleDevTools(),
            },
            { type: 'separator' },
            { label: TRAY_MENU_BUTTON_LABEL_QUIT, role: 'quit', click: () => this.onCloseApplication() },
        ]);

        this.tray.setContextMenu(menu);
    }

    private async configureTray() {
        this.tray = new Tray(await getIcon());
        this.tray.setToolTip(this.translationService.getTranslation('APP_NAME'));
    }

    private onCloseApplication() {
        app.quit();
    }

    private onToggleDevTools() {
        DmaDesktopApp.toggleDevTools();
    }
}
