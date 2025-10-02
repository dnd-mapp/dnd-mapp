import { TestBed } from '@angular/core/testing';
import { OverlayService } from './overlay.service';

describe('OverlayService', () => {
    function setupTest() {
        TestBed.configureTestingModule({});

        return {
            service: TestBed.inject(OverlayService),
        };
    }

    it('should create', () => {
        const { service } = setupTest();
        expect(service).toBeDefined();
    });
});
