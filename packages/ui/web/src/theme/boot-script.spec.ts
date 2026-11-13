import { TestBed } from '@angular/core/testing';
import { commands } from 'vitest/browser';
import { ThemeService } from './theme.service';
import { Theme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme.types';

/**
 * The boot script in the `index.html` of the web app can't import from this package, so it repeats the key and the
 * values of `ThemeService`. These tests run the script after the service saves each theme, and check that the script
 * applies what the service applied.
 */
describe('The boot script of the web app', () => {
    const root = document.documentElement;
    let bootScript: () => void;

    beforeAll(async () => {
        // The path resolves from the root of this package, and the moon tasks that run the tests list the file as input.
        const html = await commands.readFile('../../../apps/web/src/index.html');
        const scripts = new DOMParser().parseFromString(html, 'text/html').head.querySelectorAll('script:not([src])');

        expect(scripts).toHaveLength(1);
        // eslint-disable-next-line @typescript-eslint/no-implied-eval -- Runs the script as the browser would.
        bootScript = new Function(scripts[0]?.textContent ?? '') as () => void;
    });

    beforeEach(() => {
        localStorage.removeItem(THEME_STORAGE_KEY);
        root.removeAttribute(THEME_ATTRIBUTE);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.removeItem(THEME_STORAGE_KEY);
        root.removeAttribute(THEME_ATTRIBUTE);
    });

    it.each<Theme>(Object.values(Theme))('should apply %s as ThemeService does', (theme) => {
        TestBed.inject(ThemeService).setTheme(theme);
        const applied = root.getAttribute(THEME_ATTRIBUTE);
        root.removeAttribute(THEME_ATTRIBUTE);

        bootScript();

        expect(root.getAttribute(THEME_ATTRIBUTE)).toBe(applied);
    });

    it('should set no data-theme for a value ThemeService does not know', () => {
        localStorage.setItem(THEME_STORAGE_KEY, 'sepia');

        bootScript();

        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });

    it('should not throw when localStorage throws', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new DOMException('The browser blocks storage for this site.', 'SecurityError');
        });

        expect(bootScript).not.toThrow();
        expect(root.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
    });
});
