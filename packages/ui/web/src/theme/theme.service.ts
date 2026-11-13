import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DEFAULT_THEME, parseTheme, Theme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme.types';

/**
 * Owns the color scheme that the reader picks. It saves a choice of Dark or Light in `localStorage` and sets it as
 * `data-theme` on `<html>`, and follows a change made in another tab. The boot script in the `index.html` of the web
 * app applies the saved choice before the app boots, so this service only reads it at start.
 *
 * During prerendering it reports System and changes nothing, since the page it renders is the same for every reader.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly document = inject(DOCUMENT);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly storage = this.isBrowser ? this.localStorage() : null;
    private readonly _theme = signal<Theme>(DEFAULT_THEME);

    /** The reader's choice: System until they pick Dark or Light. */
    public readonly theme = this._theme.asReadonly();

    constructor() {
        if (!this.isBrowser) {
            return;
        }
        this._theme.set(this.read());

        const view = this.document.defaultView;
        const onStorage = (event: StorageEvent) => {
            this.onStorage(event);
        };

        view?.addEventListener('storage', onStorage);
        inject(DestroyRef).onDestroy(() => view?.removeEventListener('storage', onStorage));
    }

    /** Saves `theme` and applies it. System removes the saved choice, so the page follows the device again. */
    public setTheme(theme: Theme): void {
        if (!this.isBrowser) {
            return;
        }
        const valid = parseTheme(theme);

        this.write(valid);
        this.apply(valid);
    }

    /** Applies a choice that another tab saved. A `null` key means that tab cleared all of `localStorage`. */
    private onStorage(event: StorageEvent): void {
        if (event.storageArea !== this.storage || (event.key !== null && event.key !== THEME_STORAGE_KEY)) {
            return;
        }
        this.apply(parseTheme(event.key === null ? null : event.newValue));
    }

    private apply(theme: Theme): void {
        const root = this.document.documentElement;

        if (theme === Theme.System) {
            root.removeAttribute(THEME_ATTRIBUTE);
        } else {
            root.setAttribute(THEME_ATTRIBUTE, theme);
        }
        this._theme.set(theme);
    }

    /** Reads the saved choice. Without one, or without `localStorage`, the reader is on System. */
    private read(): Theme {
        try {
            return parseTheme(this.storage?.getItem(THEME_STORAGE_KEY) ?? null);
        } catch {
            return DEFAULT_THEME;
        }
    }

    /**
     * Saves the choice. When the browser blocks `localStorage` or it is full, the choice still applies until the page
     * reloads.
     */
    private write(theme: Theme): void {
        try {
            if (theme === Theme.System) {
                this.storage?.removeItem(THEME_STORAGE_KEY);
            } else {
                this.storage?.setItem(THEME_STORAGE_KEY, theme);
            }
        } catch {
            // The choice applies to this page only.
        }
    }

    /** Reading `localStorage` throws when the browser blocks storage for the site, such as for cookies turned off. */
    private localStorage(): Storage | null {
        try {
            return this.document.defaultView?.localStorage ?? null;
        } catch {
            return null;
        }
    }
}
