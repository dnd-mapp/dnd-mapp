import { Component, signal } from '@angular/core';
import { page } from 'vitest/browser';
import { LogoComponent, type LogoKind, type LogoSize } from './logo.component';
import { LogoHarness, setupTestEnvironment } from '../../../testing';

describe('LogoComponent', () => {
    @Component({
        template: `<dma-logo />`,
        imports: [LogoComponent],
    })
    class DefaultTestComponent {}

    @Component({
        template: `<dma-logo [kind]="kind()" [size]="size()" />`,
        imports: [LogoComponent],
    })
    class TestComponent {
        public readonly kind = signal<LogoKind>('full');
        public readonly size = signal<LogoSize>('large');
    }

    async function setupTest(inputs: { kind?: LogoKind; size?: LogoSize } = {}) {
        if (!inputs.kind && !inputs.size) {
            return await setupTestEnvironment(DefaultTestComponent, LogoHarness);
        }
        const environment = await setupTestEnvironment(TestComponent, LogoHarness);

        const host = environment.fixture.componentInstance;

        if (inputs.kind) {
            host.kind.set(inputs.kind);
        }
        if (inputs.size) {
            host.size.set(inputs.size);
        }

        return environment;
    }

    describe.each<LogoKind>(['full', 'mark'])('of kind %s', (kind) => {
        it.each<LogoSize>(['large', 'small'])('should be named D&D Mapp at size %s', async (size) => {
            const { fixture } = await setupTest({ kind, size });
            await fixture.whenStable();

            await expect.element(page.getByRole('img', { name: 'D&D Mapp' })).toBeInTheDocument();
        });
    });

    it('should show the wordmark by default', async () => {
        const { harness } = await setupTest();

        expect(await harness.getWordmarkText()).toBe('D&D Mapp');
    });

    it('should show the mark alone', async () => {
        const { harness } = await setupTest({ kind: 'mark' });

        expect(await harness.getWordmarkText()).toBeNull();
    });

    it('should hide the mark from assistive technology', async () => {
        const { harness } = await setupTest();

        expect(await harness.isMarkHidden()).toBe(true);
    });

    it.each<[LogoSize | undefined, number]>([
        [undefined, 40],
        ['large', 40],
        ['small', 32],
    ])('should draw the mark of size %s at %i px', async (size, pixels) => {
        const { harness } = await setupTest(size ? { size } : {});

        expect(await harness.getMarkSize()).toEqual({ width: pixels, height: pixels });
    });
});
