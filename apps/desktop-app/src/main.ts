import { DmaDesktopApp, ElectronEvents, UpdateEvents } from './app';

export default class Main {
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
    // Bootstrap the application
    Main.bootstrapApp();
    Main.bootstrapAppEvents();
})();
