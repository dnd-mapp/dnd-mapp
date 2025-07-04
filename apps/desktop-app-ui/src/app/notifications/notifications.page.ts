import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

const MAX_LENGTH_TITLE = 40 as const;

const MAX_LENGTH_MESSAGE = 100 as const;

@Component({
    selector: 'dma-notifications',
    templateUrl: './notifications.page.html',
    styleUrl: './notifications.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ReactiveFormsModule],
})
export class NotificationsPage {
    private readonly formBuilder = inject(FormBuilder);

    protected readonly form = this.formBuilder.group({
        title: this.formBuilder.control(null, [Validators.required, Validators.maxLength(MAX_LENGTH_TITLE)]),
        message: this.formBuilder.control(null, [Validators.required, Validators.maxLength(MAX_LENGTH_MESSAGE)]),
    });

    protected onShowMessage() {
        console.log(this.form.value);
    }
}
