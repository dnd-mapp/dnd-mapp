import { Component, signal, Type } from '@angular/core';
import { ButtonHarness, createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { ButtonComponent } from './button.component';
import { ButtonType } from './models';

describe('ButtonComponent', () => {
    @Component({
        template: `<button dma-button>My Button</button>`,
        imports: [ButtonComponent],
    })
    class BasicTestComponent {}

    @Component({
        template: `<button [dma-button]="buttonType()" [disabled]="disabled()" [processing]="processing()">
            My Button
        </button>`,
        imports: [ButtonComponent],
    })
    class TestComponent {
        public readonly buttonType = signal<ButtonType>('secondary');
        public readonly disabled = signal(false);
        public readonly processing = signal(false);
    }

    interface TestParams<T> {
        component: Type<T>;
    }

    async function setupTest<T>(params: TestParams<T> = { component: BasicTestComponent as Type<T> }) {
        const { harness, fixture } = await createTestEnvironment({
            testComponent: params.component,
            harness: ButtonHarness,
        });

        return {
            harness: harness,
            fixture: fixture,
            component: fixture.componentInstance,
        };
    }

    it('should create', async () => {
        const { harness } = await setupTest();
        expect(harness).not.toBeNull();
    });

    it('should set the button type', async () => {
        const { harness, component } = await setupTest({ component: TestComponent });

        expect(await harness.getButtonType()).toBe('secondary');

        component.buttonType.set('primary');
        expect(await harness.getButtonType()).toBe('primary');
    });

    it('should toggle disabled', async () => {
        const { harness, component } = await setupTest({ component: TestComponent });

        expect(await harness.isDisabled()).toBeFalse();

        component.disabled.set(true);
        expect(await harness.isDisabled()).toBeTrue();
    });

    it('should toggle processing', async () => {
        const { harness, component } = await setupTest({ component: TestComponent });

        expect(await harness.isProcessing()).toBeFalse();
        const buttonWidth = await harness.getButtonWidth();

        component.processing.set(true);
        expect(await harness.isProcessing()).toBeTrue();
        expect(await harness.isDisabled()).toBeTrue();
        expect(await harness.getButtonWidth()).toEqual(buttonWidth);
    });
});
