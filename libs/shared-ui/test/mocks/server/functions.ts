import { RequestHandler } from 'msw';
import { setupWorker, SetupWorker } from 'msw/browser';

let worker: SetupWorker;

export function getMockServiceWorker() {
    return worker;
}

async function initializeWorker() {
    await worker.start({
        quiet: true,
        onUnhandledRequest: 'warn',
    });
}

function resetWorker() {
    worker.resetHandlers();
}

function stopWorker() {
    worker.stop();
}

export function setupMockServiceWorker(...handlers: RequestHandler[]) {
    worker = setupWorker(...handlers);

    return {
        initializeWorker: initializeWorker,
        resetWorker: resetWorker,
        stopWorker: stopWorker,
    };
}
