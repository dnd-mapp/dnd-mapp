import { TranslationService } from '@/common';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import enUS from '../../../public/localization/en-US.json';
import { expectRequest } from '../http';

export async function loadTestingTranslations() {
    const translationService = TestBed.inject(TranslationService);
    const request = lastValueFrom(translationService.initialize());

    expectRequest({
        url: '/localization/en-US.json',
        body: enUS,
    });
    await request;
}
