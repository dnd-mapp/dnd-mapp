import { tryCatch } from '@dnd-mapp/shared';
import { DmaDesktopApp } from './app';

// Disable usage of bufferutil by the ws package.
// Bufferutil uses node-gyp and would need to be recompiled when the app is packaged.
// Since recompiling node-gyp is impossible for electron-builder when targeting platform,
// disabling the usage of bufferutil seemed like the best route.
// source: https://github.com/websockets/ws?tab=readme-ov-file#opt-in-for-performance
process.env['WS_NO_BUFFER_UTILS'] = 'true';

async function main() {
    await DmaDesktopApp.bootstrapApp();
}

(async () => {
    await tryCatch(main());
})();
