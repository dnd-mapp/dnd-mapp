import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Locale } from '@dnd-mapp/desktop-shared';
import { from } from 'rxjs';
import { DESKTOP_APP_API } from '../core/api';
import { TranslatePipe } from '../localisation';
import { localeOptions } from './models';

@Component({
    selector: 'dma-settings',
    templateUrl: `./settings.page.html`,
    styleUrl: './settings.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class SettingsPage implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly desktopAppApi = inject(DESKTOP_APP_API);

    protected readonly form = this.formBuilder.group({
        locale: this.formBuilder.control(null, [Validators.required]),
    });

    protected readonly localeOptions = localeOptions;

    public ngOnInit() {
        from(this.desktopAppApi.locale())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (locale) => this.onReceiveInitialLocale(locale),
            });
    }

    protected onApplySettings() {
        from(this.desktopAppApi.updateLocale(this.form.value.locale))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.form.reset(this.form.value);
                },
            });
    }

    private onReceiveInitialLocale(locale: Locale) {
        this.form.controls.locale.setValue(locale);
        this.form.updateValueAndValidity();
    }
}
