import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from '../../localisation';
import { TopBarComponent } from '../top-bar';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, TopBarComponent],
})
export class RootComponent implements OnInit, OnDestroy {
    private readonly destroyRef = inject(DestroyRef);
    private readonly translationService = inject(TranslationService);

    public ngOnInit() {
        this.translationService.listenForTranslationsChanges();

        this.translationService.retrieveInitialTranslations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    public ngOnDestroy() {
        this.translationService.cleanUpListeners();
    }
}
