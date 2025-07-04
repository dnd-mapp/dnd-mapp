import { tryCatch } from '@dnd-mapp/shared';
import { DmaDesktopApp } from './app';

async function main() {
    DmaDesktopApp.bootstrapApp();
}

(async () => {
    await tryCatch(main());
})();
