import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { ThemeDirective } from '@dnd-mapp/shared-ui';
import { HeaderComponent } from '../header';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [HeaderComponent, RouterOutlet],
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
