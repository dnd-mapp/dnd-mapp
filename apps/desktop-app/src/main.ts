import { tryCatch } from '@dnd-mapp/shared';
import { DmaDesktopApp, ElectronEvents } from './app';

async function main() {
    DmaDesktopApp.bootstrapApp();
    ElectronEvents.bootstrapElectronEvents();
}

(async () => {
    await tryCatch(main());
})();
