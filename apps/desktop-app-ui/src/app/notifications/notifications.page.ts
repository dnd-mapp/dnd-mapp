import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationData } from '@dnd-mapp/desktop-shared';
import { from } from 'rxjs';
import { DESKTOP_APP_API } from '../core/api';

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
    private readonly destroyRef = inject(DestroyRef);
    private readonly desktopAppApi = inject(DESKTOP_APP_API);

    protected readonly form = this.formBuilder.group({
        title: this.formBuilder.control('Hello', [Validators.required, Validators.maxLength(MAX_LENGTH_TITLE)]),
        message: this.formBuilder.control('This is a test message.', [
            Validators.required,
            Validators.maxLength(MAX_LENGTH_MESSAGE),
        ]),
    });

    protected onShowMessage() {
        from(this.desktopAppApi.sendNotification(this.form.value as NotificationData))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
