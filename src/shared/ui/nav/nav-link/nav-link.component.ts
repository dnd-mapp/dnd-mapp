import { ChangeDetectionStrategy, Component, inject, input, OnInit, Signal } from '@angular/core';
import { isActive, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'dma-nav-link',
    templateUrl: './nav-link.component.html',
    styleUrl: './nav-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.active]': 'active()',
        '[class.icon-only]': 'iconOnly()',
    },
    imports: [RouterLink],
})
export class NavLinkComponent implements OnInit {
    private readonly router = inject(Router);

    public readonly route = input.required<string>();

    public readonly iconOnly = input(false);

    protected active!: Signal<boolean>;

    public ngOnInit() {
        this.active = isActive(this.route(), this.router, {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
        });
    }
}
