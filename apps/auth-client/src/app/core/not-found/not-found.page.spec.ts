import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HomeHarness } from '@dnd-mapp/auth-client/testing';
import { appRoutes } from '../config';
import { RootComponent } from '../root';

describe('NotFoundPage', () => {
    @Component({
        template: '<dma-root />',
        imports: [RootComponent],
    })
    class TestComponent {}

    async function setupTest() {
        TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [provideZonelessChangeDetection(), provideRouter(appRoutes)],
        });

        const harnessLoader = TestbedHarnessEnvironment.loader(TestBed.createComponent(TestComponent));
        const router = TestBed.inject(Router);

        await router.navigateByUrl('/');

        return {
            harnessLoader: harnessLoader,
            router: router,
            harness: await harnessLoader.getHarness(HomeHarness),
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
