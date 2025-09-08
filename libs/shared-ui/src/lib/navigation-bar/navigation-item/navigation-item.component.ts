import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    inject,
    input,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
    selector: 'dma-navigation-item',
    templateUrl: './navigation-item.component.html',
    styleUrl: './navigation-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.active]': 'active()',
        '[style.flex-basis]': 'minWidth()',
        '(click)': 'onClick()',
    },
    imports: [],
})
export class NavigationItemComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);

    public readonly label = input.required<string>();

    public readonly route = input.required<string>();

    public readonly active = signal(false);

    public readonly minWidth = signal<string>('auto');

    protected readonly icons = contentChildren('dmaNavItemIcon');

    protected readonly hasOneIcon = computed(() => this.icons().length === 1);

    protected onClick() {
        from(this.router.navigateByUrl(this.route()))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.active.set(true),
            });
    }
}
