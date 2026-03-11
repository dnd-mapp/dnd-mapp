import { ButtonHarness, setupTestEnvironment } from '@/test';
import { Component, signal } from '@angular/core';
import { ButtonColor, ButtonColors } from './button-colors';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    @Component({
        template: `<button type="button" [dma-button]="color()">My label</button>`,
        imports: [ButtonComponent],
    })
    class TestComponent {
        public readonly color = signal<ButtonColor | ''>(ButtonColors.PRIMARY);
    }

    async function setupTest() {
        const { harness, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: ButtonHarness,
        });

        return {
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should set button color', async () => {
        const { harness, componentInstance } = await setupTest();

        expect(await harness.color()).toEqual(ButtonColors.PRIMARY);

        componentInstance.color.set(ButtonColors.SECONDARY);
        expect(await harness.color()).toEqual(ButtonColors.SECONDARY);

        componentInstance.color.set('');
        expect(await harness.color()).toEqual(ButtonColors.PRIMARY);
    });
});
