// organize-imports-ignore
import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { resetMockResourceDbs, resourceServerHandlers, setupMockServiceWorker } from './mocks';

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

@NgModule({
    providers: [provideZonelessChangeDetection()],
})
class ZonelessTestingModule {}

getTestBed().initTestEnvironment([BrowserTestingModule, ZonelessTestingModule], platformBrowserTesting());
