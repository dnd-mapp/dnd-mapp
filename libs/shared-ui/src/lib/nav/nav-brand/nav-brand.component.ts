import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dma-nav-brand',
    templateUrl: './nav-brand.component.html',
    styleUrl: './nav-brand.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class NavBrandComponent {}
