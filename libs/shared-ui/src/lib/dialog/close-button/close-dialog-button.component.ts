import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../button';
import { XmarkIcon } from '../../icons';
import { DialogRef } from '../dialog-ref';

@Component({
    selector: 'dma-close-dialog-button',
    templateUrl: './close-dialog-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, XmarkIcon],
})
export class CloseDialogButtonComponent {
    private readonly dialogRef = inject(DialogRef);

    protected onCloseDialog() {
        this.dialogRef.close();
    }
}
