import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    DestroyRef,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';
import { NavigationItemComponent } from './navigation-item';

@Component({
    selector: 'dma-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrl: './navigation-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class NavigationBarComponent implements AfterContentInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly items = contentChildren(NavigationItemComponent);

    private get activeItems() {
        return this.items().filter((item) => item.active());
    }

    private get hasActiveItems() {
        return this.activeItems.length > 0;
    }

    public ngAfterContentInit() {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                tap(({ url }) => this.updateActiveItem(url)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.calculateSpacePerItem();
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
        // TODO: Replace magic numbers with actual values.
        // Divides the minimum bar size (when in horizontal mode, which equals the minimum width of a medium window),
        // minus the total padding of the bar, by the root font size.
        const availableSpace = (600 - 80) / 16;
        const minWidth = availableSpace / this.items().length;

        this.items().forEach((item) => item.minWidth.set(`${minWidth}em`));
    }
}
