import { TranslateDirective } from '@/common';
import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { BarsIcon, IconDirective } from '../../icons';
import { SidePanelService } from '../../side-panel';
import { TooltipAnchorDirective } from '../../tooltip';
import { NAV_PANEL } from '../provide-nav-panel';

@Component({
    selector: 'dma-nav-panel-toggle',
    templateUrl: './nav-panel-toggle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BarsIcon, ButtonComponent, IconDirective, TooltipAnchorDirective, TranslateDirective],
})
export class NavPanelToggleComponent<T = unknown> {
    private readonly sidePanelService = inject(SidePanelService);
    private readonly navPanel = inject<Type<T>>(NAV_PANEL);

    protected onToggleNavPanel() {
        this.sidePanelService.open(this.navPanel);
    }
}
