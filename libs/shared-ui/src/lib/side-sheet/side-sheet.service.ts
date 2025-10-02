import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { computed, inject, Injectable, signal, Type } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OverlayService } from '../overlay';
import { VisibilityState, VisibilityStates } from './models';
import { SideSheetComponent } from './side-sheet.component';

@Injectable({ providedIn: 'root' })
export class SideSheetService<T> {
    private readonly overlay = inject(Overlay);
    private readonly overlayService = inject(OverlayService);

    private readonly visibility = signal<VisibilityState>(VisibilityStates.HIDDEN);

    public readonly isVisible = computed(() => this.visibility() === VisibilityStates.VISIBLE);

    private readonly isHidden = computed(() => !this.isVisible());

    private component: Type<T>;

    private overlayRef: OverlayRef;

    private destroy$ = new Subject<void>();

    public destroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setComponent(component: Type<T>) {
        this.component = component;
    }

    public toggle() {
        if (this.isVisible()) this.hide();
        else this.show();
    }

    private show() {
        if (this.isVisible()) return;
        this.visibility.set(VisibilityStates.VISIBLE);

        const { overlayRef } = this.overlayService.show({
            scrollingStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global().top('3.5em'),
            hasBackdrop: true,
            backdropClass: ['dma-side-sheet-backdrop'],
            height: 'calc(100% - 3.5em)',
        });

        this.overlayRef = overlayRef;
        const componentRef = this.overlayRef.attach(new ComponentPortal(SideSheetComponent));

        componentRef.setInput('component', this.component);

        this.overlayRef
            .backdropClick()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => this.hide(),
            });
    }

    private hide() {
        if (this.isHidden()) return;
        this.visibility.set(VisibilityStates.HIDDEN);

        this.destroy$.next();

        this.overlayRef.dispose();
        this.overlayRef = null;
    }
}
