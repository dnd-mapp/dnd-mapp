import { TranslateDirective } from '@/common';
import { ButtonComponent } from '@/shared-ui';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
    selector: 'dma-home',
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, TranslateDirective, NgOptimizedImage],
})
export class HomePage {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    protected onGoToSignup() {
        console.warn('SIGN UP');
    }

    protected onGoToCompendium() {
        from(this.router.navigateByUrl('/compendium')).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
}
