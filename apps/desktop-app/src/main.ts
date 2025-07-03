import { app } from 'electron';
import { DmaDesktopApp, ElectronEvents, SquirrelEvents, UpdateEvents } from './app';

export default class Main {
    public static async initialize() {
        if (!(await SquirrelEvents.handleEvents())) return;
        // Squirrel event handled (except first run event) and app will exit in 1000ms, so don't do anything else.
        app.quit();
    }

    public static bootstrapApp() {
        DmaDesktopApp.main();
    }

    public static bootstrapAppEvents() {
        ElectronEvents.bootstrapElectronEvents();

        // Initialize auto updater service
        if (DmaDesktopApp.isDevelopmentMode()) UpdateEvents.initAutoUpdateService();
    }
}

// Handle setup events as quickly as possible
(async () => {
    await Main.initialize();

    // Bootstrap the application
    Main.bootstrapApp();
    Main.bootstrapAppEvents();
})();
