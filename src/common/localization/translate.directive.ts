import { TranslationKey, TranslationService } from '@/common';
import { Directive, inject, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dmaTranslate]',
})
export class TranslateDirective implements OnInit {
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly templateRef = inject(TemplateRef);
    private readonly translationService = inject(TranslationService);

    public ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.templateRef, {
            $implicit: (key: TranslationKey) => this.translate(key),
        });
    }

    protected translate(key: TranslationKey) {
        const translation = this.translationService.translations()![key];

        if (!translation) {
            console.warn(`missing translation for key "${key}"`);
            return key;
        }
        return translation;
    }
}
