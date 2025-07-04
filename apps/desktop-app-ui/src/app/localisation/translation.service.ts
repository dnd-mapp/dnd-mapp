import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { TranslationKey, Translations } from '@dnd-mapp/desktop-shared';
import { from, Subscription, tap } from 'rxjs';
import { DESKTOP_APP_API } from '../core/api';

@Injectable({ providedIn: 'root' })
export class TranslationService {
    private readonly desktopAppApi = inject(DESKTOP_APP_API);

    private readonly translations = signal<Translations>(null);

    private readonly listeners = new Subscription();

    public getTranslation(key: TranslationKey) {
        return linkedSignal(() => (this.translations() === null ? key : this.translations()[key]));
    }

    public retrieveInitialTranslations() {
        return from(this.desktopAppApi.translations()).pipe(
            tap((translations) => {
                this.translations.set(translations);
            })
        );
    }

    public listenForTranslationsChanges() {
        this.listeners.add(
            this.desktopAppApi.onTranslationsUpdated((translations) => {
                this.translations.set(translations);
            })
        );
    }

    public cleanUpListeners() {
        this.listeners.unsubscribe();
    }
}
