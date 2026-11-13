import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { StorageService } from '../storage';
import { DEFAULT_THEME, parseTheme, Theme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme.types';

/**
 * Owns the color scheme that the reader picks. It saves a choice of Dark or Light through `StorageService` and sets it
 * as `data-theme` on `<html>`, and follows a change made in another tab. The boot script in the `index.html` of the web
 * app applies the saved choice before the app boots, so this service only reads it at start.
 *
 * During prerendering it reports System and changes nothing, since the page it renders is the same for every reader.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly document = inject(DOCUMENT);
    private readonly storage = inject(StorageService);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly _theme = signal<Theme>(DEFAULT_THEME);

    /** The reader's choice: System until they pick Dark or Light. */
    public readonly theme = this._theme.asReadonly();

    /** Applies a choice that another tab saved or removed. */
    private readonly onChange = (value: string | null) => {
        this.apply(parseTheme(value));
    };

    constructor() {
        if (!this.isBrowser) {
            return;
        }
        this._theme.set(parseTheme(this.storage.get(THEME_STORAGE_KEY)));
        this.storage.watch(THEME_STORAGE_KEY, this.onChange);
    }

    /**
     * Saves `theme` and applies it. System removes the saved choice, so the page follows the device again. When the
     * choice can't be saved, it still applies until the page reloads: the reader can't fix blocked or full storage, and
     * a picker that ignored the choice would look broken.
     */
    public setTheme(theme: Theme): void {
        if (!this.isBrowser) {
            return;
        }
        const valid = parseTheme(theme);

        if (valid === Theme.System) {
            this.storage.remove(THEME_STORAGE_KEY);
        } else {
            this.storage.set(THEME_STORAGE_KEY, valid);
        }
        this.apply(valid);
    }

    private apply(theme: Theme) {
        const root = this.document.documentElement;

        if (theme === Theme.System) {
            root.removeAttribute(THEME_ATTRIBUTE);
        } else {
            root.setAttribute(THEME_ATTRIBUTE, theme);
        }
        this._theme.set(theme);
    }
}
