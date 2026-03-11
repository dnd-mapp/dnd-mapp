import { StorageKeys } from '@/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { NavRailToggleComponent } from './nav-rail-toggle/nav-rail-toggle.component';

@Component({
    selector: 'dma-nav-rail',
    templateUrl: './nav-rail.component.html',
    styleUrl: './nav-rail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.collapsed]': 'collapsed()',
    },
    imports: [NavRailToggleComponent],
})
export class NavRailComponent implements OnInit {
    private readonly storageService = inject(StorageService);

    protected readonly collapsed = signal(false);

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
