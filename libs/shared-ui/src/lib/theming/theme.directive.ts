import { computed, Directive, DOCUMENT, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DEFAULT_THEME, ThemeName, ThemeNames } from './theme';
import { themes } from './themes';

@Directive({
    selector: '[dmaTheme]',
})
export class ThemeDirective {
    private readonly document = inject(DOCUMENT);

    private readonly theme = signal(DEFAULT_THEME);

    private readonly styles = computed(() => this.getThemeVariables(this.theme()));

    private readonly styles$ = toObservable(this.styles).pipe(
        tap((styles) => (this.document.documentElement.style = styles)),
    );

    private mediaQueryList: MediaQueryList;

    private readonly mediaQueryChangeListener = (event: MediaQueryListEvent) => {
        this.theme.set(event.matches ? ThemeNames.DARK : ThemeNames.LIGHT);
    };

    public initialize() {
        this.mediaQueryList = matchMedia('(prefers-color-scheme: dark)');

        this.mediaQueryList.addEventListener('change', this.mediaQueryChangeListener);

        if (!this.mediaQueryList.matches) return this.styles$;
        this.theme.set(ThemeNames.DARK);

        return this.styles$;
    }

    public destroy() {
        this.mediaQueryList.removeEventListener('change', this.mediaQueryChangeListener);
    }

    private getThemeVariables(theme: ThemeName) {
        const themeVariables = themes[theme];
        let styles = '';

        Object.entries(themeVariables).forEach(([themeVariable, value]) => {
            styles += `--${themeVariable}: ${value}; `;
        });

        return styles.trim();
    }
}
