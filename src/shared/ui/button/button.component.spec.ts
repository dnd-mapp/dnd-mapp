import { ButtonHarness, setupTestEnvironment } from '@/test';
import { Component, signal, Type } from '@angular/core';
import { IconDirective, UserPlusIcon } from '../icons';
import { ButtonColor, ButtonColors } from './button-colors';
import { ButtonSize, ButtonSizes } from './button-sizes';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    @Component({
        template: `<button type="button" [dma-button]="color()" [size]="size()">My label</button>`,
        imports: [ButtonComponent],
    })
    class TestComponent {
        public readonly color = signal<ButtonColor | ''>(ButtonColors.PRIMARY);

        public readonly size = signal<ButtonSize>(ButtonSizes.MEDIUM);
    }

    @Component({
        template: `<button type="button" dma-button iconButton>
            <dma-icon dma-user-plus-icon dmaIcon />
            My label
        </button>`,
        imports: [ButtonComponent, UserPlusIcon, IconDirective],
    })
    class IconTestComponent {}

    interface SetupTestParams<T> {
        component: Type<T>;
    }

    async function setupTest<T>(params: SetupTestParams<T>) {
        const { harness, componentInstance } = await setupTestEnvironment({
            testComponent: params.component,
            harness: ButtonHarness,
        });

        return {
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should set button color', async () => {
        const { harness, componentInstance } = await setupTest({ component: TestComponent });

        expect(await harness.color()).toEqual(ButtonColors.PRIMARY);
        expect(await harness.label()).toEqual('My label');

        componentInstance.color.set(ButtonColors.SECONDARY);
        expect(await harness.color()).toEqual(ButtonColors.SECONDARY);

        componentInstance.color.set('');
        expect(await harness.color()).toEqual(ButtonColors.BASE);
    });

    it('should set button size', async () => {
        const { harness, componentInstance } = await setupTest({ component: TestComponent });

        expect(await harness.size()).toEqual(ButtonSizes.MEDIUM);

        componentInstance.size.set(ButtonSizes.LARGE);
        expect(await harness.size()).toEqual(ButtonSizes.LARGE);
    });

    it('should show only icon', async () => {
        const { harness } = await setupTest({ component: IconTestComponent });

        expect(await harness.isIconOnly()).toEqual(true);

        // Even though a label has been set, we only show the icon.
        expect(await harness.label()).toEqual('');
    });
});
