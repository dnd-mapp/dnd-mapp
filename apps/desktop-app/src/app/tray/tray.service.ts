import { app, Menu, Tray } from 'electron';
import { DmaDesktopApp } from '../dma-desktop.app';
import { getIcon } from '../utils';

export class TrayService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new TrayService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: TrayService;

    private tray: Tray;

    private constructor() {}

    public destroy(): null {
        this.tray.destroy();

        TrayService._instance = null;
        return null;
    }

    public configureContextMenu() {
        const menu = Menu.buildFromTemplate([
            {
                label: DmaDesktopApp.devToolsShown() ? 'Close DevTools' : 'Open DevTools',
                click: () => this.onToggleDevTools(),
            },
            { label: 'Quit', role: 'quit', click: () => this.onCloseApplication() },
        ]);

        this.tray.setContextMenu(menu);
    }

    private async initialize() {
        this.tray = new Tray(await getIcon());

        this.tray.setToolTip('DnD Mapp');

        this.configureContextMenu();
    }

    private onCloseApplication() {
        app.quit();
    }

    private onToggleDevTools() {
        DmaDesktopApp.toggleDevTools();
    }
}
