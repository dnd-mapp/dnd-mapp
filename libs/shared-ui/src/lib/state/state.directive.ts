import { Directive, signal } from '@angular/core';
import { States } from './states';

@Directive({
    selector: '[dmaState]',
    exportAs: 'dmaState',
    host: {
        '[class.dma-focussing]': 'focussing()',
        '[class.dma-hovering]': 'hovering()',
        '[class.dma-pressing]': 'pressing()',
        '[class.dma-dragging]': 'dragging()',
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()',
        '(mouseenter)': 'onMouseenter()',
        '(mouseleave)': 'onMouseleave()',
        '(mousedown)': 'onMousedown()',
        '(window:mouseup)': 'onMouseup()',
        '(dragstart)': 'onDragstart()',
        '(window:dragend)': 'onDragend()',
    },
})
export class StateDirective {
    public readonly opacity = signal(0);

    protected readonly hovering = signal(false);

    protected readonly pressing = signal(false);

    protected readonly focussing = signal(false);

    protected readonly dragging = signal(false);

    protected onFocus() {
        this.opacity.update((opacity) => opacity + States.FOCUS);
        this.focussing.set(true);
    }

    protected onBlur() {
        this.opacity.update((opacity) => opacity - States.FOCUS);
        this.focussing.set(false);
    }

    protected onMouseenter() {
        this.opacity.update((opacity) => opacity + States.HOVER);
        this.hovering.set(true);
    }

    protected onMouseleave() {
        this.opacity.update((opacity) => opacity - States.HOVER);
        this.hovering.set(false);
    }

    protected onMousedown() {
        this.opacity.update((opacity) => opacity + States.PRESSING);
        this.pressing.set(true);
    }

    protected onMouseup() {
        if (!this.pressing()) return;
        this.opacity.update((opacity) => opacity - States.PRESSING);
        this.pressing.set(false);
    }

    protected onDragstart() {
        this.opacity.update((opacity) => opacity + States.DRAGGING);
        this.dragging.set(true);
    }

    protected onDragend() {
        if (!this.dragging()) return;
        this.opacity.update((opacity) => opacity - States.DRAGGING);
        this.dragging.set(false);
    }
}
