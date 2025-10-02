// organize-imports-ignore
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import {
    resetMockResourceDbs,
    resourceServerHandlers,
    setupMockServiceWorker,
    ZonelessTestingModule,
} from '@dnd-mapp/shared-ui/test';

const { initializeWorker, resetWorker, stopWorker } = setupMockServiceWorker(...resourceServerHandlers);

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
