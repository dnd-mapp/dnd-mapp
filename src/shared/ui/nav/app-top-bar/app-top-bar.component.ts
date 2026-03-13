import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavBrandComponent } from '../nav-brand/nav-brand.component';

@Component({
    selector: 'dma-app-top-bar',
    templateUrl: './app-top-bar.component.html',
    styleUrl: './app-top-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NavBrandComponent],
})
export class AppTopBarComponent {}
