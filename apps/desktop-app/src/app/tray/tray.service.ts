import { Menu, Tray, app } from 'electron';
import { DEFAULT_ICON_PATH } from '../constants';

export class TrayService {
    public static instance() {
        if (this._instance) return this._instance;
        this._instance = new TrayService();

        return this._instance;
    }
    private static _instance: TrayService;

    private tray: Tray;

    private constructor() {
        this.initializeTray();
    }

    public destroy(): null {
        this.tray.destroy();

        TrayService._instance = null;
        return null;
    }

    private initializeTray() {
        this.tray = new Tray(DEFAULT_ICON_PATH);

        this.tray.setToolTip('DnD Mapp');

        this.configureContextMenu();
    }

    private configureContextMenu() {
        const menu = Menu.buildFromTemplate([{ label: 'Quit', role: 'quit', click: () => this.onCloseApplication() }]);

        this.tray.setContextMenu(menu);
    }

    private onCloseApplication() {
        app.quit();
    }
}
