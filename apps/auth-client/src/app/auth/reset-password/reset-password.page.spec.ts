import { Component } from '@angular/core';
import { ResetPasswordHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { ResetPasswordPage } from './reset-password.page';

describe('ResetPasswordPage', () => {
    @Component({
        imports: [ResetPasswordPage],
        template: '<dma-reset-password />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: ResetPasswordHarness,
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
