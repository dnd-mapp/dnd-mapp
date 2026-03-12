import { NavBrandHarness, setupTestEnvironment } from '@/test';
import { Component, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NavBrandComponent } from './nav-brand.component';

describe('NavBrandComponent', () => {
    @Component({
        template: `<dma-nav-brand [imageOnly]="imageOnly()" />`,
        imports: [NavBrandComponent],
    })
    class TestComponent {
        public readonly imageOnly = signal(false);
    }

    async function setupTest() {
        const { harness, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavBrandHarness,
            providers: [provideRouter([])],
        });

        return {
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should only show image', async () => {
        const { harness, componentInstance } = await setupTest();

        expect(await harness.label()).toEqual('D&D Mapp');

        componentInstance.imageOnly.set(true);
        expect(await harness.label()).toEqual('');
    });
});
