import { DestroyRef, Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ThemeService } from './theme.service';
import { DEFAULT_THEME, themeAttribute } from './themes';

@Directive({
    selector: '[dmaTheme]',
    providers: [ThemeService],
})
export class ThemeDirective implements OnInit {
    private readonly elementRef = inject(ElementRef);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);

    public readonly theme = input(DEFAULT_THEME, { transform: themeAttribute, alias: 'dmaTheme' });

    constructor() {
        toObservable(this.theme)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (theme) => this.themeService.setTheme(theme),
            });
    }

    public ngOnInit() {
        this.themeService.setHostElement(this.elementRef.nativeElement);
    }
}
