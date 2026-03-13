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
        if (this.overlayRef) {
            this.attach(component);
            return;
        }
        const scrollingStrategy = this.overlay.scrollStrategies.block();

        const positionStrategy = this.overlay.position().global().start('0').top('0').bottom('0');

        this.overlayRef = this.overlay.create({
            positionStrategy: positionStrategy,
            scrollStrategy: scrollingStrategy,
            disposeOnNavigation: true,
            hasBackdrop: true,
        });

        this.attach(component);
    }

    public close() {
        if (!this.componentRef) return;
        this.componentRef.destroy();
        this.componentRef = undefined;
    }

    private attach<T>(component: Type<T>) {
        if (!this.overlayRef || this.componentRef) return;
        this.componentRef = this.overlayRef.attach(new ComponentPortal(SidePanelComponent));
        this.componentRef.setInput('sidePanelBody', component);
    }
}
