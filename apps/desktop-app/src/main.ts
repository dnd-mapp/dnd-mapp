import { tryCatch } from '@dnd-mapp/shared';
import { DmaDesktopApp, ElectronEvents } from './app';

async function main() {
    DmaDesktopApp.bootstrapApp();
    ElectronEvents.bootstrapElectronEvents();
}

(async () => {
    const { error } = await tryCatch(main());

    if (error) {
        console.error(error);
    }
})();
