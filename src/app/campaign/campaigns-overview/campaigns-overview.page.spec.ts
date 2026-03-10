import { CampaignsOverviewHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { CampaignsOverviewPage } from './campaigns-overview.page';

describe('CampaignsOverviewPage', () => {
    @Component({
        template: `<dma-campaigns-overview />`,
        imports: [CampaignsOverviewPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: CampaignsOverviewHarness,
        });

        return {
            harness: harness,
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
