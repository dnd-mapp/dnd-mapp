import { tryCatch } from '@dnd-mapp/shared';
import { spawn } from 'child_process';
import { app } from 'electron';
import { basename, join, resolve } from 'path';
import { argv, execPath, platform } from 'process';
import { environment } from '../../environments';

/**
 * This module is responsible on handling all the setup events that is submitted by squirrel.
 */
export class SquirrelEvents {
    private static isAppFirstRun = false;

    // App paths
    private static appFolder = resolve(execPath, '..');
    private static appRootFolder = resolve(this.appFolder, '..');
    private static updateExe = resolve(join(this.appRootFolder, 'Update.exe'));
    private static exeName = resolve(join(this.appRootFolder, `app-${environment.version}`, basename(execPath)));

    public static async handleEvents() {
        if (argv.length === 1 || platform !== 'win32') return false;

        switch (argv[1]) {
            case '--squirrel-install':
            case '--squirrel-updated':
                // Install desktop and start menu shortcuts
                await this.update('--createShortcut', this.exeName);

                return true;

            case '--squirrel-uninstall':
                // Remove desktop and start menu shortcuts
                await this.update('--removeShortcut', this.exeName);

                return true;

            case '--squirrel-obsolete':
                app.quit();
                return true;

            case '--squirrel-firstrun':
                // Check if it is the first run of the software
                SquirrelEvents.isAppFirstRun = true;
                return false;
        }
        return false;
    }

    public static isFirstRun = () => SquirrelEvents.isAppFirstRun;

    private static async update(...args: string[]) {
        const { error } = await tryCatch(
            spawn(SquirrelEvents.updateExe, args, { detached: true }).on('close', () =>
                setTimeout(() => app.quit(), 1000)
            )
        );

        if (error) {
            console.error(error);
            setTimeout(() => app.quit(), 1000);
        }
    }
}
