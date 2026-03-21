import { TranslateDirective } from '@/common';
import { TooltipAnchorDirective } from '@/shared-ui';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { IconDirective, XmarkIcon } from '../../icons';
import { SidePanelService } from '../side-panel.service';

@Component({
    selector: 'dma-close-side-panel-button',
    templateUrl: './close-side-panel-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, XmarkIcon, IconDirective, TranslateDirective, TooltipAnchorDirective],
})
export class CloseSidePanelButtonComponent {
    private readonly sidePanelService = inject(SidePanelService);

    protected onCloseSidePanel() {
        this.sidePanelService.close();
    }
}
