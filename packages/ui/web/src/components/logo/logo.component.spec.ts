import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { LogoComponent, type LogoKind, type LogoSize } from './logo.component';

describe('LogoComponent', () => {
    async function setupTest(inputs: { kind?: LogoKind; size?: LogoSize } = {}) {
        const fixture = TestBed.createComponent(LogoComponent);

        for (const [name, value] of Object.entries(inputs)) {
            fixture.componentRef.setInput(name, value);
        }
        await fixture.whenStable();

        const host = fixture.nativeElement as HTMLElement;
        const mark = host.querySelector('svg');
        assert(mark, 'The logo draws no mark.');

        return {
            logo: page.getByRole('img', { name: 'D&D Mapp' }),
            mark,
            wordmark: host.querySelector('.wordmark'),
        };
    }

    describe.each<LogoKind>(['full', 'mark'])('of kind %s', (kind) => {
        it.each<LogoSize>(['large', 'small'])('should be named D&D Mapp at size %s', async (size) => {
            const { logo } = await setupTest({ kind, size });

            await expect.element(logo).toBeInTheDocument();
        });
    });

    it('should show the wordmark by default', async () => {
        const { wordmark } = await setupTest();

        expect(wordmark?.textContent).toBe('D&D Mapp');
    });

    it('should show the mark alone', async () => {
        const { wordmark } = await setupTest({ kind: 'mark' });

        expect(wordmark).toBeNull();
    });

    it('should hide the mark from assistive technology', async () => {
        const { mark } = await setupTest();

        expect(mark.getAttribute('aria-hidden')).toBe('true');
    });

    it.each<[LogoSize | undefined, number]>([
        [undefined, 40],
        ['large', 40],
        ['small', 32],
    ])('should draw the mark of size %s at %i px', async (size, pixels) => {
        const { mark } = await setupTest(size ? { size } : {});
        const { width, height } = mark.getBoundingClientRect();

        expect({ width, height }).toEqual({ width: pixels, height: pixels });
    });
});
