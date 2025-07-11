import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-dialog-footer',
    templateUrl: './dialog-footer.component.html',
    styleUrl: './dialog-footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFooterComponent {}
