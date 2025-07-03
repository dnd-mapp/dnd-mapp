import { app, ipcMain } from 'electron';
import { environment } from '../../environments';

/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */
export class ElectronEvents {
    public static bootstrapElectronEvents = () => ipcMain;
}

// Retrieve app version
ipcMain.handle('get-app-version', () => {
    console.log(`Fetching application version... [v${environment.version}]`);

    return environment.version;
});

// Handle App termination
ipcMain.on('quit', (_event, code) => {
    console.log('Terminating app...');

    app.exit(code);
});
