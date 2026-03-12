import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dma-nav-brand',
    templateUrl: './nav-brand.component.html',
    styleUrl: './nav-brand.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.icon-only]': 'imageOnly()',
    },
    imports: [RouterLink],
})
export class NavBrandComponent {
    public readonly imageOnly = input.required<boolean>();
}
