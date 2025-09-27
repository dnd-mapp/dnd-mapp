import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-side-sheet',
    templateUrl: './side-sheet.component.html',
    styleUrl: './side-sheet.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class SideSheetComponent {}
