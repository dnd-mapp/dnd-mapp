import { Component } from '@angular/core';
import { LoginHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
    @Component({
        imports: [LoginPage],
        template: '<dma-login />',
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: LoginHarness,
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
