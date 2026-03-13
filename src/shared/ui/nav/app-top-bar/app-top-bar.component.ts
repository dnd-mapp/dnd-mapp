import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavBrandComponent } from '../nav-brand/nav-brand.component';
import { NavPanelToggleComponent } from '../nav-panel-toggle/nav-panel-toggle.component';

@Component({
    selector: 'dma-app-top-bar',
    templateUrl: './app-top-bar.component.html',
    styleUrl: './app-top-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NavBrandComponent, NavPanelToggleComponent],
})
export class AppTopBarComponent {}
