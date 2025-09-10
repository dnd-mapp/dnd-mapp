import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    ElementRef,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';
import { observeWidth } from '../rxjs';
import { getRootFontSize, windowSizeMedium } from '../theming';
import { DEFAULT_NAVIGATION_BAR_LAYOUT, NAVIGATION_BAR_PADDING, NavigationBarLayouts } from './models';
import { NavigationBarService } from './navigation-bar.service';
import { NavigationItemComponent } from './navigation-item';

@Component({
    selector: 'dma-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrl: './navigation-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.navigation-bar-layout-horizontal]': 'layoutIsHorizontal()',
    },
    imports: [],
})
export class NavigationBarComponent implements AfterContentInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly navigationBarService = inject(NavigationBarService);

    public readonly items = contentChildren(NavigationItemComponent);

    public readonly layoutIsHorizontal = computed(() => this.layout() === NavigationBarLayouts.HORIZONTAL);

    private readonly layout = signal(DEFAULT_NAVIGATION_BAR_LAYOUT);

    private get activeItems() {
        return this.items().filter((item) => item.active());
    }

    private get hasActiveItems() {
        return this.activeItems.length > 0;
    }

    public ngAfterContentInit() {
        this.navigationBarService.updateItems([...this.items()]);

        this.calculateSpacePerItem();

        if (this.layoutShouldBeHorizontal()) {
            this.layout.set(NavigationBarLayouts.HORIZONTAL);
        }
        observeWidth(this.elementRef.nativeElement)
            .pipe(
                tap(() => {
                    const layout = this.layoutShouldBeHorizontal()
                        ? NavigationBarLayouts.HORIZONTAL
                        : NavigationBarLayouts.VERTICAL;

                    if (layout === this.layout()) return;
                    this.layout.set(layout);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                tap(({ url }) => this.updateActiveItem(url)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private updateActiveItem(url: string) {
        if (!this.hasActiveItems) {
            this.setActiveItemForCurrentRoute(url);
            return;
        }
        const item = this.activeItems.find((item) => url !== item.route());
        item.active.set(false);
    }

    private setActiveItemForCurrentRoute(url: string) {
        const item = this.findItemByRoute(url);
        item.active.set(true);
    }

    private findItemByRoute(url: string) {
        return this.items().find((item) => url.includes(item.route()));
    }

    private calculateSpacePerItem() {
        const rootFontSize = getRootFontSize();
        const padding = NAVIGATION_BAR_PADDING * rootFontSize * 2;
        const minNavigationBarWidth = windowSizeMedium * rootFontSize;

        // Divides the minimum bar size (when in horizontal mode, which equals the minimum width of a medium window),
        // minus the total padding of the bar, by the root font size.
        const availableSpace = (minNavigationBarWidth - padding) / rootFontSize;
        const minWidth = availableSpace / this.items().length;

        this.items().forEach((item) => item.minWidth.set(minWidth));
    }

    private layoutShouldBeHorizontal() {
        return this.elementRef.nativeElement.clientWidth >= windowSizeMedium * getRootFontSize();
    }
}
