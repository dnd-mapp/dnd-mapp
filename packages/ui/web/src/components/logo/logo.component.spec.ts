import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { LogoComponent } from './logo.component';
import { LogoKind, LogoSize } from './logo.types';
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
        public readonly kind = signal<LogoKind>(LogoKind.Full);
        public readonly size = signal<LogoSize>(LogoSize.Large);
    }

    async function setupTest<Host>(hostComponent: Type<Host>) {
        const { fixture, harness } = await setupTestEnvironment({ host: hostComponent, harness: LogoHarness });

        return { harness, host: fixture.componentInstance };
    }

    describe.each<LogoKind>(Object.values(LogoKind))('of kind %s', (kind) => {
        it.each<LogoSize>(Object.values(LogoSize))('should be named D&D Mapp at size %s', async (size) => {
            const { host } = await setupTest(TestComponent);
            host.kind.set(kind);
            host.size.set(size);
            // Renders the variant before the query, which would otherwise find the logo as the host first rendered it.
            TestBed.tick();

            await expect.element(page.getByRole('img', { name: 'D&D Mapp' })).toBeInTheDocument();
        });
    });

    it('should show the wordmark by default', async () => {
        const { harness } = await setupTest(DefaultTestComponent);

        expect(await harness.getWordmarkText()).toBe('D&D Mapp');
    });

    it('should show the mark alone', async () => {
        const { harness, host } = await setupTest(TestComponent);
        host.kind.set(LogoKind.Mark);

        expect(await harness.getWordmarkText()).toBeNull();
    });

    it('should hide the mark from assistive technology', async () => {
        const { harness } = await setupTest(DefaultTestComponent);

        expect(await harness.isMarkHidden()).toBe(true);
    });

    it('should draw the mark at 40 px by default', async () => {
        const { harness } = await setupTest(DefaultTestComponent);

        expect(await harness.getMarkSize()).toEqual({ width: 40, height: 40 });
    });

    it.each<[LogoSize, number]>([
        [LogoSize.Large, 40],
        [LogoSize.Small, 32],
    ])('should draw the mark of size %s at %i px', async (size, pixels) => {
        const { harness, host } = await setupTest(TestComponent);
        host.size.set(size);

        expect(await harness.getMarkSize()).toEqual({ width: pixels, height: pixels });
    });

    it('should show the wordmark for a kind it does not know', async () => {
        const { harness, host } = await setupTest(TestComponent);
        host.kind.set('unknown' as LogoKind);

        expect(await harness.getWordmarkText()).toBe('D&D Mapp');
    });

    it('should draw the large mark for a size it does not know', async () => {
        const { harness, host } = await setupTest(TestComponent);
        host.size.set('unknown' as LogoSize);

        expect(await harness.getMarkSize()).toEqual({ width: 40, height: 40 });
    });
});
