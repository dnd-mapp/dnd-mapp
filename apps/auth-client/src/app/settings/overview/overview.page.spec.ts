import { Component } from '@angular/core';
import { SettingsOverviewHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { SettingsOverviewPage } from './overview.page';

describe('SettingsOverviewPage', () => {
    @Component({
        imports: [SettingsOverviewPage],
        template: '<dma-settings-overview />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: SettingsOverviewHarness,
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
