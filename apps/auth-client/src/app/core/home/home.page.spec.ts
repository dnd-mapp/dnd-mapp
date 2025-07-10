import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HomeHarness } from '@dnd-mapp/auth-client/testing';
import { HomePage } from './home.page';

describe('HomePage', () => {
    @Component({
        template: ` <dma-home />`,
        imports: [HomePage],
    })
    class TestComponent {}

    async function setupTest() {
        TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [provideZonelessChangeDetection()],
        });

        const harnessLoader = TestbedHarnessEnvironment.loader(TestBed.createComponent(TestComponent));

        return {
            harness: await harnessLoader.getHarness(HomeHarness),
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
