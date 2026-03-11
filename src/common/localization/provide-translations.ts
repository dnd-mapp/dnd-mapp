import { TranslationService } from '@/common';
import { inject, provideAppInitializer } from '@angular/core';

export function provideTranslations() {
    return provideAppInitializer(() => {
        return inject(TranslationService).initialize();
    });
}
