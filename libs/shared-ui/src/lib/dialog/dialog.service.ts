import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector, inject } from '@angular/core';
import { DialogRef } from './dialog-ref';

export const DIALOG_DATA = new InjectionToken<unknown>('DIALOG_DATA');

export function provideDialogData<D = unknown>(data: D) {
    return { provide: DIALOG_DATA, useValue: data };
}

export function provideDialogRef<T, R = unknown>(dialogRef: DialogRef<T, R>) {
    return { provide: DialogRef, useValue: dialogRef };
}

export interface DialogConfig<D = unknown> {
    data?: D;
    hasBackdrop?: boolean;
    backdropClass?: string | string[];
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
    private readonly overlay = inject(Overlay);

    public open<T, D = unknown, R = unknown>(component: ComponentType<T>, config: DialogConfig<D>) {
        const overlayRef = this.overlay.create({
            disposeOnNavigation: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            panelClass: 'dma-dialog-pane',
            ...config,
        });

        const dialogRef = new DialogRef<T, R>(overlayRef);

        const injector = Injector.create({
            providers: [provideDialogData(config.data ?? null), provideDialogRef(dialogRef)],
        });
        dialogRef.componentRef = overlayRef.attach(new ComponentPortal(component, null, injector));

        return dialogRef;
    }
}
