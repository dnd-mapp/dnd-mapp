import { Menu, Tray, app, screen } from 'electron';
import { ICON_PATH } from '../constants';

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
        this.tray = new Tray(ICON_PATH);

        console.log(screen.getPrimaryDisplay().scaleFactor);

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
