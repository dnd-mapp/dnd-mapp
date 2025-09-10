import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { BadgeTargetDirective, badgeTypeAttribute, BadgeTypes, DEFAULT_BADGE_TYPE } from '../../badge';
import { StateDirective, StateLayerComponent } from '../../state';
import { NavigationBarComponent } from '../navigation-bar.component';

@Component({
    selector: 'dma-navigation-item',
    templateUrl: './navigation-item.component.html',
    styleUrl: './navigation-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [StateDirective],
    host: {
        '[class.active]': 'active()',
        '[style.width.em]': 'width()',
        '(click)': 'onClick()',
    },
    imports: [StateLayerComponent, BadgeTargetDirective],
})
export class NavigationItemComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly navigationBar = inject(NavigationBarComponent);

    private readonly badge = viewChild(BadgeTargetDirective);

    public readonly label = input.required<string>();

    public readonly route = input.required<string>();

    public readonly badgeType = input(DEFAULT_BADGE_TYPE, { transform: badgeTypeAttribute });

    public readonly active = signal(false);

    public readonly minWidth = signal(0);

    protected readonly icons = contentChildren('dmaNavItemIcon');

    protected readonly hasOneIcon = computed(() => this.icons().length === 1);

    protected readonly width = computed(() => (this.navigationBar.layoutIsHorizontal() ? this.minWidth() : ''));

    protected readonly currentBadgeType = computed(() =>
        this.navigationBar.layoutIsHorizontal() ? BadgeTypes.SMALL : this.badgeType()
    );

    public showBadge(badgeLabel?: number) {
        if (this.badge().badgeIsShowing) return;
        this.badge().showBadge(badgeLabel);
    }

    public updateBadge(badgeLabel: number) {
        if (!this.badge().badgeIsShowing) return;
        this.badge().updateBadge(badgeLabel);
    }

    protected onClick() {
        from(this.router.navigateByUrl(this.route()))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.active.set(true);

                    if (this.badge().badgeIsShowing) {
                        this.badge().removeBadge();
                    }
                },
            });
    }
}
