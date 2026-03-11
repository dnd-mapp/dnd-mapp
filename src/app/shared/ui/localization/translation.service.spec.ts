import { TestBed } from '@angular/core/testing';

import { expectRequest, provideHttpTesting, setupTestEnvironment } from '@/test';
import { HttpTestingController } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
    async function setupTest() {
        await setupTestEnvironment({
            providers: [provideHttpTesting()],
        });

        return {
            service: TestBed.inject(TranslationService),
        };
    }

    afterEach(() => {
        TestBed.inject(HttpTestingController).verify();
    });

    it('should initialize', async () => {
        const { service } = await setupTest();

        expect(service.translations()).toEqual(null);

        const response = lastValueFrom(service.initialize());

        expectRequest({
            url: '/localization/en-US.json',
            body: {},
        });

        await response;
        expect(service.translations()).toEqual({});
    });
});
