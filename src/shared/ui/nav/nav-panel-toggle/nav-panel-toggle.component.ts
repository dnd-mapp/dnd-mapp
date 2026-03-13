import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { BarsIcon, IconDirective } from '../../icons';
import { SidePanelService } from '../../side-panel';
import { NAV_PANEL } from '../provide-nav-panel';

@Component({
    selector: 'dma-nav-panel-toggle',
    templateUrl: './nav-panel-toggle.component.html',
    styleUrl: './nav-panel-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BarsIcon, ButtonComponent, IconDirective],
})
export class NavPanelToggleComponent<T = unknown> {
    private readonly sidePanelService = inject(SidePanelService);
    private readonly navPanel = inject<Type<T>>(NAV_PANEL);

    protected onToggleNavPanel() {
        this.sidePanelService.open(this.navPanel);
    }
}
