import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
export class NavRailComponent {
    protected readonly collapsed = signal(false);

    protected onToggle(collapsed: boolean) {
        this.collapsed.set(collapsed);
    }
}
