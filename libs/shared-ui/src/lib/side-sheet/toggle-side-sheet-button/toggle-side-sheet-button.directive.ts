import { Directive, inject } from '@angular/core';
import { SideSheetService } from '../side-sheet.service';

@Directive({
    selector: '[dmaToggleSideSheetButton]',
    exportAs: 'dmaToggleSideSheetButton',
    host: {
        '(click)': 'onToggle()',
    },
})
export class ToggleSideSheetButtonDirective {
    private readonly sideSheetService = inject(SideSheetService);

    public isSideSheetVisible = this.sideSheetService.isVisible;

    protected onToggle() {
        this.sideSheetService.toggle();
    }
}
