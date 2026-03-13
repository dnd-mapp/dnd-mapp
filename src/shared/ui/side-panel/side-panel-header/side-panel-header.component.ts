import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavBrandComponent } from '../../nav';
import { CloseSidePanelButtonComponent } from '../close-side-panel-button/close-side-panel-button.component';

@Component({
    selector: 'dma-side-panel-header',
    templateUrl: './side-panel-header.component.html',
    styleUrl: './side-panel-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CloseSidePanelButtonComponent, NavBrandComponent],
})
export class SidePanelHeaderComponent {}
