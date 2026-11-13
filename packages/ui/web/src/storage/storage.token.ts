import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { tryCatchSync } from '@dnd-mapp/common';

/**
 * The storage that `StorageService` reads and writes: `localStorage` by default. It is `null` during prerendering, and
 * when the browser blocks storage for the site, since reading `localStorage` then throws. Provide another `Storage`,
 * such as `sessionStorage` or an `InMemoryStorage` in a test, to swap it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage | null>('BROWSER_STORAGE', {
    providedIn: 'root',
    factory: () => {
        if (!isPlatformBrowser(inject(PLATFORM_ID))) {
            return null;
        }
        const view = inject(DOCUMENT).defaultView;
        const storage = tryCatchSync(() => view?.localStorage ?? null);

        return storage.ok ? storage.value : null;
    },
});
