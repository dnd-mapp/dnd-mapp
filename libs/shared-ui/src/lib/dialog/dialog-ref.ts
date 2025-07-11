import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';

export class DialogRef<DialogType, ResultType = unknown> {
    public componentRef: ComponentRef<DialogType>;

    private readonly overlayRef: OverlayRef;

    private readonly close$ = new Subject<ResultType>();

    constructor(overlayRef: OverlayRef) {
        this.overlayRef = overlayRef;
    }

    public close(result?: ResultType) {
        this.close$.next(result);
        this.close$.complete();

        this.componentRef.destroy();
        this.overlayRef.dispose();
    }

    public afterClose() {
        return this.close$.asObservable();
    }
}
