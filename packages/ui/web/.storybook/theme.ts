import { type Signal, signal } from '@angular/core';
import { applicationConfig } from '@storybook/angular-vite';
import { Theme, ThemeService } from '../src/theme';

/**
 * Stands in for `ThemeService`, so each story picks the option it shows as selected, and a click moves the selection
 * without changing the theme of the preview, which the theme toolbar owns.
 */
class StoryThemeService {
    private readonly _theme = signal<Theme>(Theme.System);

    public readonly theme: Signal<Theme> = this._theme.asReadonly();

    constructor(selected: Theme) {
        this._theme.set(selected);
    }

    public setTheme(theme: Theme): void {
        this._theme.set(theme);
    }
}

/** Provides a stand-in for `ThemeService` that reports `selected`, for the stories of a component with a Theme picker. */
export function withSelectedTheme(selected: Theme) {
    return applicationConfig({
        providers: [{ provide: ThemeService, useFactory: () => new StoryThemeService(selected) }],
    });
}
