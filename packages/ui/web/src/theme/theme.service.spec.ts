import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { Theme, THEME_ATTRIBUTE } from './theme.types';
import { InMemoryStorage, provideBrowserStorage, providePlatformId, setupTestEnvironment } from '../../testing';
import { StorageKey } from '../storage';

interface SetupOptions {
    /** The value saved under the key of the theme before the service starts. */
    saved?: string;
    /** The `data-theme` that the boot script set before the service starts. */
    applied?: Theme;
    /** Makes the storage throw, as a browser does when it blocks storage for the site. */
    blocked?: boolean;
    /** Uses `localStorage`, since a `StorageEvent` accepts only a storage of the browser as its `storageArea`. */
    local?: boolean;
    platformId?: 'browser' | 'server';
}

describe('ThemeService', () => {
    function setupTest({ saved, applied, blocked = false, local = false, platformId = 'browser' }: SetupOptions = {}) {
        const root = document.documentElement;
        const memory = new InMemoryStorage();
        const storage = local ? localStorage : memory;

        if (saved !== undefined) {
            storage.setItem(StorageKey.Theme, saved);
        }
        if (applied !== undefined) {
            root.setAttribute(THEME_ATTRIBUTE, applied);
        }
        memory.blocked = blocked;
        setupTestEnvironment({ providers: [providePlatformId(platformId), provideBrowserStorage(storage)] });

        return { service: TestBed.inject(ThemeService), storage, root };
    }

    afterEach(() => {
        localStorage.removeItem(StorageKey.Theme);
        document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    });

    it('should report system when nothing is saved', () => {
        const { service } = setupTest();

        expect(service.theme()).toBe(Theme.System);
    });

    it.each<Theme>([Theme.Dark, Theme.Light])('should report a saved %s', (theme) => {
        const { service } = setupTest({ saved: theme });

        expect(service.theme()).toBe(theme);
    });

    it.each(['system', 'sepia', ''])('should report system for the saved value "%s"', (value) => {
        const { service } = setupTest({ saved: value });

        expect(service.theme()).toBe(Theme.System);
    });

    it('should leave data-theme to the boot script at start', () => {
        const { root } = setupTest({ saved: Theme.Light, applied: Theme.Dark });

        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(Theme.Dark);
    });

    it.each<Theme>([Theme.Dark, Theme.Light])('should save and apply %s', (theme) => {
        const { service, storage, root } = setupTest();

        service.setTheme(theme);

        expect(service.theme()).toBe(theme);
        expect(storage.getItem(StorageKey.Theme)).toBe(theme);
        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
    });

    it('should remove the saved choice and data-theme for system', () => {
        const { service, storage, root } = setupTest({ saved: Theme.Dark, applied: Theme.Dark });

        service.setTheme(Theme.System);

        expect(service.theme()).toBe(Theme.System);
        expect(storage.getItem(StorageKey.Theme)).toBeNull();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    it('should treat a theme it does not know as system', () => {
        const { service, storage, root } = setupTest();
        service.setTheme(Theme.Dark);

        service.setTheme('sepia' as Theme);

        expect(service.theme()).toBe(Theme.System);
        expect(storage.getItem(StorageKey.Theme)).toBeNull();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    describe('when the storage throws', () => {
        it('should report system', () => {
            const { service } = setupTest({ saved: Theme.Light, blocked: true });

            expect(service.theme()).toBe(Theme.System);
        });

        it.each<Theme>([Theme.Dark, Theme.Light, Theme.System])('should still apply %s', (theme) => {
            const { service, root } = setupTest({ blocked: true });

            service.setTheme(theme);

            expect(service.theme()).toBe(theme);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme === Theme.System ? null : theme);
        });
    });

    describe('when another tab changes the choice', () => {
        function changeInOtherTab(newValue: string | null) {
            window.dispatchEvent(
                new StorageEvent('storage', { key: StorageKey.Theme, newValue, storageArea: localStorage }),
            );
        }

        it.each<Theme>([Theme.Dark, Theme.Light])('should apply %s', (theme) => {
            const { service, root } = setupTest({ local: true });

            changeInOtherTab(theme);

            expect(service.theme()).toBe(theme);
            expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(theme);
        });

        it('should follow the device again when the other tab removes the choice', () => {
            const { service, root } = setupTest({ local: true });
            service.setTheme(Theme.Dark);

            changeInOtherTab(null);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });

        it('should ignore the change during prerendering', () => {
            const { service, root } = setupTest({ local: true, platformId: 'server' });

            changeInOtherTab(Theme.Light);

            expect(service.theme()).toBe(Theme.System);
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });
    });

    describe('during prerendering', () => {
        it('should report system whatever is saved', () => {
            const { service } = setupTest({ saved: Theme.Light, platformId: 'server' });

            expect(service.theme()).toBe(Theme.System);
        });

        it('should change nothing when a theme is set', () => {
            const { service, storage, root } = setupTest({ platformId: 'server' });

            service.setTheme(Theme.Dark);

            expect(service.theme()).toBe(Theme.System);
            expect(storage.getItem(StorageKey.Theme)).toBeNull();
            expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
        });
    });
});
