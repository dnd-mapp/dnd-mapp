import { TestBed } from '@angular/core/testing';
import { BROWSER_STORAGE } from './storage.token';
import { providePlatformId, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

describe('BROWSER_STORAGE', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should provide localStorage in the browser', () => {
        expect(TestBed.inject(BROWSER_STORAGE)).toBe(localStorage);
    });

    it('should provide null when reading localStorage throws', () => {
        vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
            throw new DOMException('The browser blocks storage for this site.', 'SecurityError');
        });

        expect(TestBed.inject(BROWSER_STORAGE)).toBeNull();
    });

    it('should provide null during prerendering', () => {
        setupTestEnvironment({ providers: [providePlatformId('server')] });

        expect(TestBed.inject(BROWSER_STORAGE)).toBeNull();
    });
});
