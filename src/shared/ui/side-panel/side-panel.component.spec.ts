import { ButtonComponent, SidePanelService } from '@/shared-ui';
import {
    ButtonHarness,
    loadTestingTranslations,
    provideHttpTesting,
    setupTestEnvironment,
    SidePanelHarness,
} from '@/test';
import { Overlay } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';

describe('SidePanelComponent', () => {
    @Component({ template: '<p>noop works!</p>' })
    class NoopComponent {}

    const routes: Routes = [{ path: '', component: NoopComponent }];

    @Component({
        template: `<button type="button" dma-button (click)="onToggleSidePanel()">Toggle side panel</button>`,
        imports: [ButtonComponent],
    })
    class TestComponent {
        private readonly sidePanelService = inject(SidePanelService);

        protected onToggleSidePanel() {
            this.sidePanelService.open(NoopComponent);
        }
    }

    async function setupTest() {
        const { harness: buttonHarness, documentRootLoader } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: ButtonHarness,
            providers: [provideRouter(routes), provideHttpTesting()],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
        });

        return {
            buttonHarness: buttonHarness!,
            documentRootLoader: documentRootLoader!,
        };
    }

    it('should open and close the side panel', async () => {
        const { documentRootLoader, buttonHarness } = await setupTest();

        let sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);

        expect(sidePanelHarness).toEqual(null);

        await buttonHarness.click();

        sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);
        expect(sidePanelHarness).toBeDefined();

        await sidePanelHarness!.closeSidePanel();

        sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);
        expect(sidePanelHarness).toEqual(null);
    });

    it('should not open another side panel when it is already open', async () => {
        const { buttonHarness } = await setupTest();
        const creatSpy = vi.spyOn(TestBed.inject(Overlay), 'create');

        expect(creatSpy).not.toHaveBeenCalled();

        await buttonHarness.click();
        await buttonHarness.click();

        expect(creatSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the side panel on navigation', async () => {
        const { buttonHarness, documentRootLoader } = await setupTest();

        await buttonHarness.click();

        let sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);
        expect(sidePanelHarness).toBeDefined();

        await sidePanelHarness!.navigateToHome();

        sidePanelHarness = await documentRootLoader.getHarnessOrNull(SidePanelHarness);
        expect(sidePanelHarness).toEqual(null);
    });
});
