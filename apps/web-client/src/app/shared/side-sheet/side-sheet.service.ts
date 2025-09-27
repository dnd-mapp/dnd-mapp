import { computed, Injectable, signal } from '@angular/core';
import { VisibilityState, VisibilityStates } from './models';

@Injectable({ providedIn: 'root' })
export class SideSheetService {
    private readonly visibility = signal<VisibilityState>(VisibilityStates.HIDDEN);

    public readonly isVisible = computed(() => this.visibility() === VisibilityStates.VISIBLE);

    public toggle() {
        if (this.isVisible()) this.hide();
        else this.show();
    }

    private show() {
        this.visibility.set(VisibilityStates.VISIBLE);
        console.warn('SHOWING SIDE SHEET');
    }

    private hide() {
        this.visibility.set(VisibilityStates.HIDDEN);
        console.warn('HIDING SIDE SHEET');
    }
}
