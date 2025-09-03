import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CloseDialogButtonComponent } from '../close-button/close-dialog-button.component';

@Component({
    selector: 'dma-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrl: './dialog-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, CloseDialogButtonComponent],
})
export class DialogHeaderComponent {}
