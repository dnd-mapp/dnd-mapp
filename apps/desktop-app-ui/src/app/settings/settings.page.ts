import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Locale, SeverityLevel } from '@dnd-mapp/desktop-shared';
import { combineLatestWith, from } from 'rxjs';
import { DESKTOP_APP_API } from '../core/api';
import { TranslatePipe } from '../localisation';
import { localeOptions, logLevelOptions } from './models';

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
        logLevel: this.formBuilder.control(null, [Validators.required]),
    });

    protected readonly localeOptions = localeOptions;
    protected readonly logLevelOptions = logLevelOptions;

    public ngOnInit() {
        from(this.desktopAppApi.locale())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (locale) => this.onReceiveInitialLocale(locale),
            });

        from(this.desktopAppApi.logLevel())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (logLevel) => this.onReceiveInitialLogLevel(logLevel),
            });
    }

    protected onApplySettings() {
        from(this.desktopAppApi.updateLocale(this.form.value.locale))
            .pipe(
                combineLatestWith(from(this.desktopAppApi.updateLogLevel(this.form.value.logLevel))),
                takeUntilDestroyed(this.destroyRef)
            )
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

    private onReceiveInitialLogLevel(logLevel: SeverityLevel) {
        this.form.controls.logLevel.setValue(logLevel);
        this.form.updateValueAndValidity();
    }
}
