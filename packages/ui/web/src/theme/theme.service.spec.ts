import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { Theme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme.types';
import { setupTestEnvironment } from '../../testing';

describe('ThemeService', () => {
    const root = document.documentElement;

    function setupTest(platformId = 'browser') {
        setupTestEnvironment({ providers: [{ provide: PLATFORM_ID, useValue: platformId }] });
        return TestBed.inject(ThemeService);
    }

    /** Fires the event that the browser fires in this tab when another tab of the origin changes `localStorage`. */
    function changeInOtherTab(key: string | null, newValue: string | null, storageArea: Storage = localStorage) {
        window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea }));
    }

    function blockStorage() {
        const error = new DOMException('The browser blocks storage for this site.', 'SecurityError');

        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw error;
        });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw error;
        });
        vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
            throw error;
        });
    }

    beforeEach(() => {
        localStorage.removeItem(THEME_STORAGE_KEY);
        root.removeAttribute(THEME_ATTRIBUTE);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.removeItem(THEME_STORAGE_KEY);
        root.removeAttribute(THEME_ATTRIBUTE);
    });

    it('should report system when nothing is saved', () => {
        const service = setupTest();

        expect(service.theme()).toBe(Theme.System);
    });

    it.each<Theme>([Theme.Dark, Theme.Light])('should report a saved %s', (theme) => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        const service = setupTest();

        expect(service.theme()).toBe(theme);
    });

    it.each(['system', 'sepia', ''])('should report system for the saved value "%s"', (value) => {
        localStorage.setItem(THEME_STORAGE_KEY, value);

        const service = setupTest();

        expect(service.theme()).toBe(Theme.System);
    });

    it('should leave data-theme to the boot script at start', () => {
        localStorage.setItem(THEME_STORAGE_KEY, Theme.Light);
        root.setAttribute(THEME_ATTRIBUTE, Theme.Dark);

        setupTest();

        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(Theme.Dark);
    });

    it.each<Theme>([Theme.Dark, Theme.Light])('should save and apply %s', (theme) => {
        const service = setupTest();

        service.setTheme(theme);

        expect(service.theme()).toBe(theme);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(theme);
        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
    });

    it('should remove the saved choice and data-theme for system', () => {
        localStorage.setItem(THEME_STORAGE_KEY, Theme.Dark);
        root.setAttribute(THEME_ATTRIBUTE, Theme.Dark);
        const service = setupTest();

        service.setTheme(Theme.System);

        expect(service.theme()).toBe(Theme.System);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    it('should treat a theme it does not know as system', () => {
        const service = setupTest();
        service.setTheme(Theme.Dark);

        service.setTheme('sepia' as Theme);

        expect(service.theme()).toBe(Theme.System);
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    describe('when localStorage throws', () => {
        it('should report system', () => {
            localStorage.setItem(THEME_STORAGE_KEY, Theme.Light);
            blockStorage();

            const service = setupTest();

            expect(service.theme()).toBe(Theme.System);
        });

        it.each<Theme>([Theme.Dark, Theme.Light, Theme.System])('should still apply %s', (theme) => {
            blockStorage();
            const service = setupTest();

            service.setTheme(theme);

            expect(service.theme()).toBe(theme);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme === Theme.System ? null : theme);
        });

        it('should still apply a choice when reading localStorage itself throws', () => {
            vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
                throw new DOMException('The browser blocks storage for this site.', 'SecurityError');
            });
            const service = setupTest();

            service.setTheme(Theme.Light);

            expect(service.theme()).toBe(Theme.Light);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(Theme.Light);
        });
    });

    describe('when another tab changes the choice', () => {
        it.each<Theme>([Theme.Dark, Theme.Light])('should apply %s', (theme) => {
            const service = setupTest();

            changeInOtherTab(THEME_STORAGE_KEY, theme);

            expect(service.theme()).toBe(theme);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
        });

        it('should follow the device again when the other tab removes the choice', () => {
            const service = setupTest();
            service.setTheme(Theme.Dark);

            changeInOtherTab(THEME_STORAGE_KEY, null);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });

        it('should follow the device again when the other tab clears localStorage', () => {
            const service = setupTest();
            service.setTheme(Theme.Dark);

            changeInOtherTab(null, null);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });

        it('should ignore a change to another key', () => {
            const service = setupTest();
            service.setTheme(Theme.Dark);

            changeInOtherTab('other-key', Theme.Light);

            expect(service.theme()).toBe(Theme.Dark);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(Theme.Dark);
        });

        it('should ignore a change to sessionStorage', () => {
            const service = setupTest();
            service.setTheme(Theme.Dark);

            changeInOtherTab(THEME_STORAGE_KEY, Theme.Light, sessionStorage);

            expect(service.theme()).toBe(Theme.Dark);
        });

        it('should stop listening once the app is destroyed', () => {
            setupTest();
            TestBed.resetTestingModule();

            changeInOtherTab(THEME_STORAGE_KEY, Theme.Light);

            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });
    });

    describe('during prerendering', () => {
        it('should report system whatever is saved', () => {
            localStorage.setItem(THEME_STORAGE_KEY, Theme.Light);

            const service = setupTest('server');

            expect(service.theme()).toBe(Theme.System);
        });

        it('should change nothing when a theme is set', () => {
            const service = setupTest('server');

            service.setTheme(Theme.Dark);

            expect(service.theme()).toBe(Theme.System);
            expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });

        it('should ignore the storage event', () => {
            const service = setupTest('server');

            changeInOtherTab(THEME_STORAGE_KEY, Theme.Light);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });
    });
});
