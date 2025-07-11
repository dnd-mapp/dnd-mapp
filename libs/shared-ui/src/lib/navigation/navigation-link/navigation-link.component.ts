import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'dma-navigation-link',
    templateUrl: './navigation-link.component.html',
    styleUrl: './navigation-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive],
})
export class NavigationLinkComponent {
    @Input({ required: true }) public route: string;
}
