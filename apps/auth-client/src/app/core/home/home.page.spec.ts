import { Component } from '@angular/core';
import { HomeHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { HomePage } from './home.page';

describe('HomePage', () => {
    @Component({
        template: ` <dma-home />`,
        imports: [HomePage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: HomeHarness,
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
