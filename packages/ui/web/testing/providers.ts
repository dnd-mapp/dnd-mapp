import { PLATFORM_ID, type Provider } from '@angular/core';
import { BROWSER_STORAGE } from '@dnd-mapp/ui-web';

/** Provides `storage` as `BROWSER_STORAGE`, such as an `InMemoryStorage`, or `null` for a browser without storage. */
export function provideBrowserStorage(storage: Storage | null): Provider {
    return { provide: BROWSER_STORAGE, useValue: storage };
}

/** Runs the test on `platformId`, such as `'server'` for a test of prerendering. The testing module runs on `'browser'`. */
export function providePlatformId(platformId: 'browser' | 'server'): Provider {
    return { provide: PLATFORM_ID, useValue: platformId };
}
