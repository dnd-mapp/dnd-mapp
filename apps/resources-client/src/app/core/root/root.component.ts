import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeDirective } from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [],
})
export class RootComponent implements OnInit {
    private readonly themeDirective = inject(ThemeDirective);
    private readonly destroyRef = inject(DestroyRef);

    public ngOnInit() {
        this.themeDirective.initialize().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

        this.destroyRef.onDestroy(() => {
            this.themeDirective.destroy();
        });
    }
}
