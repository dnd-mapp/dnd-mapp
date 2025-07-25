import { Injectable, signal } from '@angular/core';
import { DEFAULT_THEME, ThemeName, Themes } from './themes';

@Injectable()
export class ThemeService {
    public readonly theme = signal(DEFAULT_THEME);

    private hostElement: HTMLElement;

    public setTheme(theme: ThemeName) {
        this.theme.set(theme);
        this.updateThemeVariables();
    }

    public setHostElement(element: HTMLElement) {
        this.hostElement = element;
    }

    private updateThemeVariables() {
        if (!this.hostElement) {
            return;
        }
        const theme = Themes[this.theme()];

        if (!theme) {
            console.warn(`UNKNOWN THEME "${this.theme()}"`);
            return;
        }
        this.hostElement.removeAttribute('style');

        let styling = '';

        Object.entries(theme).forEach(([key, value]) => {
            styling += `--${key}: ${value}; `;
        });

        this.hostElement.setAttribute('style', styling.trim());
    }
}
