import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { initializeWorker, resetWorker, stopWorker } from './mocks';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
});

beforeAll(async () => {
    await initializeWorker();
});

beforeEach(() => {
    resetWorker();
});

afterAll(() => {
    stopWorker();
});
