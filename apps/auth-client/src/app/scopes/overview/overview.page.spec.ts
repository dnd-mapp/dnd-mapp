import { Component } from '@angular/core';
import { ScopesOverviewHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { ScopesOverviewPage } from './overview.page';

describe('ScopesOverviewPage', () => {
    @Component({
        imports: [ScopesOverviewPage],
        template: '<dma-scopes-overview />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: ScopesOverviewHarness,
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
