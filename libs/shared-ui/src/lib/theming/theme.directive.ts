import { Directive, effect, ElementRef, inject, input, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';
import { DEFAULT_THEME, themeAttribute } from './themes';

@Directive({
    selector: '[dmaTheme]',
    providers: [ThemeService],
})
export class ThemeDirective implements OnInit {
    private readonly elementRef = inject(ElementRef);
    private readonly themeService = inject(ThemeService);

    public readonly theme = input(DEFAULT_THEME, { transform: themeAttribute, alias: 'dmaTheme' });

    constructor() {
        effect(() => {
            this.themeService.setTheme(this.theme());
        });
    }

    public ngOnInit() {
        this.themeService.setHostElement(this.elementRef.nativeElement);
    }
}
