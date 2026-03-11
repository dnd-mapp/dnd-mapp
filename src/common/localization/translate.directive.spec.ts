import { loadTestingTranslations, provideHttpTesting, setupTestEnvironment } from '@/test';
import { Component, signal } from '@angular/core';
import { noop } from 'rxjs';
import { TranslateDirective } from './translate.directive';

describe('TranslateDirective', () => {
    @Component({
        template: `
            <ng-container *dmaTranslate="let t">
                <p>{{ t(translationKey()) }}</p>
            </ng-container>
        `,
        imports: [TranslateDirective],
    })
    class TestComponent {
        public readonly translationKey = signal('BTN_LABEL_LOG_IN');
    }

    async function setupTest() {
        const warnSpy = vi.spyOn(console, 'warn');
        warnSpy.mockImplementation(noop);

        const { fixture, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            providers: [provideHttpTesting()],
            beforeCreateComponent: async () => {
                await loadTestingTranslations();
            },
        });

        fixture?.detectChanges();
        await fixture?.whenStable();

        return {
            fixture: fixture,
            element: (fixture?.nativeElement as HTMLElement).querySelector('p'),
            componentInstance: componentInstance!,
            warnSpy: warnSpy,
        };
    }

    it('should translate', async () => {
        const { fixture, element, componentInstance, warnSpy } = await setupTest();

        expect(element?.textContent).toEqual('Log in');
        expect(warnSpy).not.toHaveBeenCalled();

        componentInstance?.translationKey.set('NONSENSE');
        fixture?.detectChanges();

        expect(element?.textContent).toEqual('NONSENSE');
        expect(warnSpy).toHaveBeenCalled();
    });
});
