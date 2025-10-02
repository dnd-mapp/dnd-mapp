import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '../config';
import { SpellsService } from './spells.service';

describe('SpellsService', () => {
    async function setupTest() {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });

        await lastValueFrom(TestBed.inject(ConfigService).initialize());

        return {
            service: TestBed.inject(SpellsService),
        };
    }

    it('should create', async () => {
        const { service } = await setupTest();
        expect(service).toBeDefined();
    });
});
