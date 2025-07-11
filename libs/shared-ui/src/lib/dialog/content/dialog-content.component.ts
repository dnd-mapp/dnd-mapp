import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-dialog-content',
    templateUrl: './dialog-content.component.html',
    styleUrl: './dialog-content.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentComponent {}
