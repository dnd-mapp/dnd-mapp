// organize-imports-ignore
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import 'reflect-metadata';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { resetMockResourceDbs, resourceServerHandlers, setupMockServiceWorker } from './mocks';
import { ZonelessTestingModule } from './utils';
import { clientHandlers } from './mocks';

const { initializeWorker, resetWorker, stopWorker } = setupMockServiceWorker(
    ...resourceServerHandlers,
    ...clientHandlers,
);

beforeAll(async () => {
    await initializeWorker();
});

afterEach(() => {
    resetWorker();
    resetMockResourceDbs();
});

afterAll(() => {
    stopWorker();
});

getTestBed().initTestEnvironment([BrowserTestingModule, ZonelessTestingModule], platformBrowserTesting());
