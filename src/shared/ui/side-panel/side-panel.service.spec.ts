import { setupTestEnvironment } from '@/test';
import { TestBed } from '@angular/core/testing';
import { SidePanelService } from './side-panel.service';

describe('SidePanelService', () => {
    async function setupTest() {
        await setupTestEnvironment();

        return {
            service: TestBed.inject(SidePanelService),
        };
    }

    it(`should not attempt to close the side panel when it isn't open`, async () => {
        const { service } = await setupTest();

        expect(() => service.close()).not.toThrowError();
    });
});
