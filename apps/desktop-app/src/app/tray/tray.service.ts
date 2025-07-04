import { app, Menu, Tray } from 'electron';
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

    private constructor() {}

    private async initialize() {
        this.translationService = await TranslationService.instance();
        this.tray = new Tray(await getIcon());

        this.tray.setToolTip('DnD Mapp');

        this.configureContextMenu();
    }

    public destroy(): null {
        this.tray.destroy();

        TrayService._instance = null;
        return null;
    }

    public configureContextMenu() {
        const {
            TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS,
            TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS,
            TRAY_MENU_BUTTON_LABEL_QUIT,
        } = this.translationService.getTranslations();

        const menu = Menu.buildFromTemplate([
            {
                label: DmaDesktopApp.devToolsShown()
                    ? TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS
                    : TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS,
                click: () => this.onToggleDevTools(),
            },
            { label: TRAY_MENU_BUTTON_LABEL_QUIT, role: 'quit', click: () => this.onCloseApplication() },
        ]);

        this.tray.setContextMenu(menu);
    }

    private onCloseApplication() {
        app.quit();
    }

    private onToggleDevTools() {
        DmaDesktopApp.toggleDevTools();
    }
}
