import { DEFAULT_LOCALE, Locale, Translations } from '@/common';
import { computed, inject, Injectable, provideAppInitializer, signal } from '@angular/core';
import { tap } from 'rxjs';
import { RequestService } from '../http/request.service';

export function provideTranslations() {
    return provideAppInitializer(() => {
        return inject(TranslationService).initialize();
    });
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
    private readonly requestService = inject(RequestService);

    public readonly translations = signal<Translations | null>(null);

    private readonly locale = signal<Locale>(DEFAULT_LOCALE);

    private readonly baseUrl = '/localization';

    private readonly localeUrl = computed(() => `${this.baseUrl}/${this.locale()}.json`);

    public initialize() {
        return this.requestService
            .get<Translations>(this.localeUrl())
            .pipe(tap((translations) => this.translations.set(translations)));
    }
}
