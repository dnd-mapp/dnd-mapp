import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationKey } from '@dnd-mapp/shared-desktop-app';
import { TranslationService } from './translation.service';

@Pipe({
    name: 'translate',
    pure: false,
})
export class TranslatePipe implements PipeTransform {
    private readonly translationService = inject(TranslationService);

    public transform(translationKey: TranslationKey) {
        return this.translationService.getTranslation(translationKey)();
    }
}
