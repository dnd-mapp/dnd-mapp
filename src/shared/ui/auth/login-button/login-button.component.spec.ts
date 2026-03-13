import { loadTestingTranslations, LoginButtonHarness, provideHttpTesting, setupTestEnvironment } from '@/test';
import { Component, signal } from '@angular/core';
import { noop } from 'rxjs';
import { LoginButtonComponent } from './login-button.component';

describe('LoginButtonComponent', () => {
    @Component({
        template: `<dma-login-button [iconOnly]="iconOnly()" />`,
        imports: [LoginButtonComponent],
    })
    class TestComponent {
        public readonly iconOnly = signal(false);
    }

    async function setupTest() {
        const { harness, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: LoginButtonHarness,
            providers: [provideHttpTesting()],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
        });

        return {
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should show only icon', async () => {
        const { harness, componentInstance } = await setupTest();

        expect(await harness.isIconVisible()).toEqual(false);
        expect(await harness.isLabelVisible()).toEqual(true);

        componentInstance.iconOnly.set(true);
        expect(await harness.isIconVisible()).toEqual(true);
        expect(await harness.isLabelVisible()).toEqual(false);
    });

    it('should login', async () => {
        const consoleSpy = vi.spyOn(console, 'warn');
        consoleSpy.mockImplementationOnce(noop);

        const { harness } = await setupTest();

        expect(consoleSpy).not.toHaveBeenCalled();

        await harness.login();

        expect(consoleSpy).toHaveBeenCalled();
    });
});
