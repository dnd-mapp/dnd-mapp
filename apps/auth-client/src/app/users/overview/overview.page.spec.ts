import { Component } from '@angular/core';
import { UsersOverviewHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { UsersOverviewPage } from './overview.page';

describe('UsersOverviewPage', () => {
    @Component({
        imports: [UsersOverviewPage],
        template: '<dma-users-overview />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: UsersOverviewHarness,
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
