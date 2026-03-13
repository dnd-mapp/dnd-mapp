import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, computed, inject, input, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SidePanelFooterComponent } from './side-panel-footer/side-panel-footer.component';
import { SidePanelHeaderComponent } from './side-panel-header/side-panel-header.component';
import { SidePanelService } from './side-panel.service';

@Component({
    selector: 'dma-side-panel',
    templateUrl: './side-panel.component.html',
    styleUrl: './side-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'animate.enter': 'swipe-in-left',
        'animate.leave': 'swipe-out-left',
    },
    imports: [SidePanelFooterComponent, SidePanelHeaderComponent, CdkPortalOutlet],
})
export class SidePanelComponent<T = unknown> {
    private readonly router = inject(Router);
    private readonly sidePanelService = inject(SidePanelService);

    public readonly sidePanelBody = input.required<Type<T>>();

    protected readonly sidePanelBodyPortal = computed(() => new ComponentPortal(this.sidePanelBody()));

    constructor() {
        this.router.events
            .pipe(
                filter((navigationEvent) => navigationEvent instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            .subscribe({
                next: () => this.sidePanelService.close(),
            });
    }
}
