import { Component } from '@angular/core';
import { RolesOverviewHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { RolesOverviewPage } from './overview.page';

describe('RolesOverviewPage', () => {
    @Component({
        imports: [RolesOverviewPage],
        template: '<dma-roles-overview />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: RolesOverviewHarness,
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
