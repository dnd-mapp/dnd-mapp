import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { Theme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme.types';
import { InMemoryStorage, setupTestEnvironment } from '../../testing';
import { BROWSER_STORAGE } from '../storage';

describe('ThemeService', () => {
    const root = document.documentElement;
    let storage: Storage;

    function setupTest(platformId = 'browser') {
        setupTestEnvironment({
            providers: [
                { provide: PLATFORM_ID, useValue: platformId },
                { provide: BROWSER_STORAGE, useValue: storage },
            ],
        });
        return TestBed.inject(ThemeService);
    }

    function blockStorage() {
        const error = new DOMException('The browser blocks storage for this site.', 'SecurityError');

        for (const method of ['getItem', 'setItem', 'removeItem'] as const) {
            vi.spyOn(storage, method).mockImplementation(() => {
                throw error;
            });
        }
    }

    beforeEach(() => {
        storage = new InMemoryStorage();
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
        storage.setItem(THEME_STORAGE_KEY, theme);

        const service = setupTest();

        expect(service.theme()).toBe(theme);
    });

    it.each(['system', 'sepia', ''])('should report system for the saved value "%s"', (value) => {
        storage.setItem(THEME_STORAGE_KEY, value);

        const service = setupTest();

        expect(service.theme()).toBe(Theme.System);
    });

    it('should leave data-theme to the boot script at start', () => {
        storage.setItem(THEME_STORAGE_KEY, Theme.Light);
        root.setAttribute(THEME_ATTRIBUTE, Theme.Dark);

        setupTest();

        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(Theme.Dark);
    });

    it.each<Theme>([Theme.Dark, Theme.Light])('should save and apply %s', (theme) => {
        const service = setupTest();

        service.setTheme(theme);

        expect(service.theme()).toBe(theme);
        expect(storage.getItem(THEME_STORAGE_KEY)).toBe(theme);
        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
    });

    it('should remove the saved choice and data-theme for system', () => {
        storage.setItem(THEME_STORAGE_KEY, Theme.Dark);
        root.setAttribute(THEME_ATTRIBUTE, Theme.Dark);
        const service = setupTest();

        service.setTheme(Theme.System);

        expect(service.theme()).toBe(Theme.System);
        expect(storage.getItem(THEME_STORAGE_KEY)).toBeNull();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    it('should treat a theme it does not know as system', () => {
        const service = setupTest();
        service.setTheme(Theme.Dark);

        service.setTheme('sepia' as Theme);

        expect(service.theme()).toBe(Theme.System);
        expect(storage.getItem(THEME_STORAGE_KEY)).toBeNull();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    describe('when the storage throws', () => {
        it('should report system', () => {
            storage.setItem(THEME_STORAGE_KEY, Theme.Light);
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
    });

    // A StorageEvent accepts only a storage of the browser as its storageArea, so these tests use localStorage.
    describe('when another tab changes the choice', () => {
        function changeInOtherTab(newValue: string | null) {
            window.dispatchEvent(
                new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue, storageArea: localStorage }),
            );
        }

        beforeEach(() => {
            storage = localStorage;
        });

        it.each<Theme>([Theme.Dark, Theme.Light])('should apply %s', (theme) => {
            const service = setupTest();

            changeInOtherTab(theme);

            expect(service.theme()).toBe(theme);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
        });

        it('should follow the device again when the other tab removes the choice', () => {
            const service = setupTest();
            service.setTheme(Theme.Dark);

            changeInOtherTab(null);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });

        it('should ignore the change during prerendering', () => {
            const service = setupTest('server');

            changeInOtherTab(Theme.Light);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });
    });

    describe('during prerendering', () => {
        it('should report system whatever is saved', () => {
            storage.setItem(THEME_STORAGE_KEY, Theme.Light);

            const service = setupTest('server');

            expect(service.theme()).toBe(Theme.System);
        });

        it('should change nothing when a theme is set', () => {
            const service = setupTest('server');

            service.setTheme(Theme.Dark);

            expect(service.theme()).toBe(Theme.System);
            expect(storage.getItem(THEME_STORAGE_KEY)).toBeNull();
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });
    });
});
