import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    ElementRef,
    inject,
    input,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { StateDirective, StateLayerComponent } from '../../state';
import { getRootFontSize } from '../../theming';

@Component({
    selector: 'dma-navigation-item',
    templateUrl: './navigation-item.component.html',
    styleUrl: './navigation-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [StateDirective],
    host: {
        '[class.active]': 'active()',
        '[style.padding]': 'paddingStyle()',
        '(click)': 'onClick()',
    },
    imports: [StateLayerComponent],
})
export class NavigationItemComponent implements AfterViewInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly elementRef = inject(ElementRef);
    private readonly router = inject(Router);

    public readonly label = input.required<string>();

    public readonly route = input.required<string>();

    public readonly active = signal(false);

    public readonly minWidth = signal(0);

    protected readonly icons = contentChildren('dmaNavItemIcon');

    protected readonly hasOneIcon = computed(() => this.icons().length === 1);

    protected paddingStyle = signal('0');

    public ngAfterViewInit() {
        const rootFontSize = getRootFontSize();

        // Calculates the current width (in ems) of the navigation item.
        const width = Number(getComputedStyle(this.elementRef.nativeElement).width.replace('px', '')) / rootFontSize;
        const padding = (this.minWidth() - width) / 2;

        this.paddingStyle.set(`0 ${padding}em`);
    }

    protected onClick() {
        from(this.router.navigateByUrl(this.route()))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.active.set(true),
            });
    }
}
