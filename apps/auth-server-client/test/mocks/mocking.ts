import { SetupWorker, setupWorker } from 'msw/browser';
import { webSocketHandlers } from './handlers';

let mswWorker: SetupWorker;

export function getMswWorker() {
    return mswWorker;
}

export async function initializeWorker() {
    mswWorker = setupWorker(...webSocketHandlers);

    await mswWorker.start({
        waitUntilReady: false,
        quiet: true,
    });
}

export function resetWorker() {
    mswWorker.resetHandlers();
}

export function stopWorker() {
    mswWorker.stop();
}
