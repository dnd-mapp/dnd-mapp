import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
    function setupTest() {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });

        return {
            service: TestBed.inject(ConfigService),
        };
    }

    it('should create', () => {
        const { service } = setupTest();
        expect(service).toBeDefined();
    });
});
