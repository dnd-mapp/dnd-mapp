import { Component } from '@angular/core';
import { SignUpHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { SignUpPage } from './sign-up.page';

describe('SignUpPage', () => {
    @Component({
        imports: [SignUpPage],
        template: '<dma-sign-up />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: SignUpHarness,
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
