import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HomeHarness } from '@dnd-mapp/auth-client/testing';
import { createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { appRoutes } from '../config';
import { RootComponent } from '../root';

describe('NotFoundPage', () => {
    @Component({
        template: '<dma-root />',
        imports: [RootComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: HomeHarness,
            providers: [provideRouter(appRoutes)],
            initFunction: async () => {
                const router = TestBed.inject(Router);
                await router.navigateByUrl('/');
            },
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
