import { TestBed } from '@angular/core/testing';
import { SideSheetService } from './side-sheet.service';

describe('SideSheet', () => {
    function setupTest() {
        TestBed.configureTestingModule({});

        return {
            service: TestBed.inject(SideSheetService),
        };
    }

    it('should be created', () => {
        const { service } = setupTest();
        expect(service).toBeDefined();
    });
});
