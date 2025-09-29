import { computed, Directive, input } from '@angular/core';
import { DEFAULT_THEME, themeAttribute, ThemeName } from './theme';
import { themes } from './themes';

@Directive({
    selector: '[dmaTheme]',
    host: {
        '[attr.style]': 'styles()',
    },
})
export class ThemeDirective {
    public readonly theme = input(DEFAULT_THEME, { alias: 'dmaTheme', transform: themeAttribute });

    protected readonly styles = computed(() => this.getThemeVariables(this.theme()));

    private getThemeVariables(theme: ThemeName) {
        const themeVariables = themes[theme];
        let styles = '';

        Object.entries(themeVariables).forEach(([themeVariable, value]) => {
            styles += `--${themeVariable}: ${value}; `;
        });

        return styles.trim();
    }
}
