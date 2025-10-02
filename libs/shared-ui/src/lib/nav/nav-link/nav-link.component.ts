import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    input,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, from } from 'rxjs';

@Component({
    selector: 'dma-nav-link',
    templateUrl: './nav-link.component.html',
    styleUrl: './nav-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.active]': 'active()',
        '(click)': 'onNavigate()',
    },
    imports: [RouterLink],
})
export class NavLinkComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly route = input.required<string>();

    public readonly exactMatch = input(false, { transform: booleanAttribute });

    protected readonly active = signal(false);

    public ngOnInit() {
        this.updateActiveState();

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => this.updateActiveState(),
            });
    }

    protected onNavigate() {
        if (this.active()) return;

        from(this.router.navigateByUrl(this.route())).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    private updateActiveState() {
        const urlTree = this.router.createUrlTree([this.route()]);

        this.active.set(
            this.router.isActive(urlTree, {
                ...(this.exactMatch()
                    ? {
                          paths: 'exact',
                          queryParams: 'exact',
                      }
                    : {
                          paths: 'subset',
                          queryParams: 'subset',
                      }),
                fragment: 'ignored',
                matrixParams: 'ignored',
            }),
        );
    }
}
