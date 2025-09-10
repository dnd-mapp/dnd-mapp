import { FlexibleConnectedPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, computed, DestroyRef, Directive, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OverlayTargetDirective } from '../overlay';
import { BadgeComponent } from './badge.component';
import { badgeTypeAttribute, BadgeTypes, DEFAULT_BADGE_TYPE } from './models';

@Directive({
    selector: '[dmaBadge]',
    exportAs: 'dmaBadge',
})
export class BadgeTargetDirective extends OverlayTargetDirective {
    private readonly destroyRef = inject(DestroyRef);

    public readonly type = input(DEFAULT_BADGE_TYPE, { alias: 'dmaBadge', transform: badgeTypeAttribute });

    public get badgeIsShowing() {
        return Boolean(this.overlayRef);
    }

    private readonly isLarge = computed(() => this.type() === BadgeTypes.LARGE);

    private overlayRef: OverlayRef;
    private componentRef: ComponentRef<BadgeComponent>;
    private positionStrategy: FlexibleConnectedPositionStrategy;

    constructor() {
        super();

        toObservable(this.type)
            .pipe(
                tap((type) => {
                    if (!this.badgeIsShowing) return;
                    this.componentRef.setInput('type', type);

                    const { x, y } = this.overlayOffset;

                    this.positionStrategy.withDefaultOffsetX(x);
                    this.positionStrategy.withDefaultOffsetY(y);
                    this.positionStrategy.apply();
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public showBadge(label?: number) {
        if (this.badgeIsShowing) return;
        const { x, y } = this.overlayOffset;

        const { componentRef, positionStrategy, overlayRef } = this.createOverlay(BadgeComponent, {
            positions: [{ originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'bottom' }],
            offsetX: x,
            offsetY: y,
            overlayConfig: {},
        });

        this.overlayRef = overlayRef;
        this.componentRef = componentRef;
        this.positionStrategy = positionStrategy;

        // Set initial input values.
        componentRef.setInput('type', this.type());
        componentRef.setInput('label', label ?? 0);
    }

    public updateBadge(label: number) {
        if (!this.badgeIsShowing) return;
        this.componentRef.setInput('label', label);
    }

    public removeBadge() {
        if (!this.badgeIsShowing) return;
        this.overlayRef.dispose();
        this.overlayRef = null;
    }

    private get overlayOffset() {
        return {
            x: this.isLarge() ? -12 : -6,
            y: this.isLarge() ? 14 : 6,
        };
    }
}
