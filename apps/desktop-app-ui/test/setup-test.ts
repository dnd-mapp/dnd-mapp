import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { DMA_DESKTOP_APP_API_NAMESPACE } from '@dnd-mapp/desktop-shared';
import { clearMocks, mockDesktopAppApi } from './mocking';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
});

beforeEach(() => {
    window[DMA_DESKTOP_APP_API_NAMESPACE] = mockDesktopAppApi;

    clearMocks();
});
