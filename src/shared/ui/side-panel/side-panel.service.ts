import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, inject, Injectable, Type } from '@angular/core';
import { SidePanelComponent } from './side-panel.component';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
    private readonly overlay = inject(Overlay);

    private overlayRef: OverlayRef | undefined;
    private componentRef: ComponentRef<SidePanelComponent> | undefined;

    public open<T>(component: Type<T>) {
        if (this.overlayRef) return;
        const scrollingStrategy = this.overlay.scrollStrategies.block();

        const positionStrategy = this.overlay.position().global().start('0').top('0').bottom('0');

        this.overlayRef = this.overlay.create({
            positionStrategy: positionStrategy,
            scrollStrategy: scrollingStrategy,
            disposeOnNavigation: true,
            hasBackdrop: true,
        });

        this.componentRef = this.overlayRef.attach(new ComponentPortal(SidePanelComponent));

        this.componentRef.setInput('sidePanelBody', component);
    }

    public close() {
        if (!this.overlayRef) return;
        this.overlayRef.dispose();

        this.overlayRef = undefined;
    }
}
