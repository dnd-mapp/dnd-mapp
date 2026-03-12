import { StorageKeys, TranslationService } from '@/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, tap } from 'rxjs';
import { StorageService } from '../../storage/storage.service';
import { TooltipAnchorDirective } from '../../tooltip';
import { NavBrandComponent } from '../nav-brand/nav-brand.component';
import { NavRailToggleComponent } from './nav-rail-toggle/nav-rail-toggle.component';

const NAV_RAIL_COLLAPSE_ANIM_TIME_MS = 100;

@Component({
    selector: 'dma-nav-rail',
    templateUrl: './nav-rail.component.html',
    styleUrl: './nav-rail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.collapsed]': 'collapsed()',
    },
    imports: [NavRailToggleComponent, NavBrandComponent, TooltipAnchorDirective],
})
export class NavRailComponent implements OnInit {
    private readonly storageService = inject(StorageService);
    private readonly translationService = inject(TranslationService);

    protected readonly collapsed = signal(false);

    public readonly isCollapsed = this.collapsed.asReadonly();

    protected readonly tooltipLabel = computed(() => {
        const translations = this.translationService.translations();
        const collapsed = this.collapsed();

        if (!translations) return '';
        return collapsed ? translations.LABEL_SIDEBAR_EXPAND : translations.LABEL_SIDEBAR_COLLAPSE;
    });

    private readonly collapseToggleTooltip = viewChild('tooltip', { read: TooltipAnchorDirective });

    constructor() {
        toObservable(this.collapsed)
            .pipe(
                debounceTime(NAV_RAIL_COLLAPSE_ANIM_TIME_MS),
                tap(() => this.collapseToggleTooltip()?.reposition()),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    public ngOnInit() {
        this.initializeCollapseState();
    }

    protected onToggle(collapsed: boolean) {
        this.storageService.setItem(StorageKeys.NAV_RAIL_COLLAPSED, collapsed);
        this.collapsed.set(collapsed);
    }

    private initializeCollapseState() {
        const collapsed = this.retrieveCollapseStateFromStorage();
        this.collapsed.set(collapsed);
    }

    private retrieveCollapseStateFromStorage() {
        return Boolean(this.storageService.getItem<boolean>(StorageKeys.NAV_RAIL_COLLAPSED));
    }
}
