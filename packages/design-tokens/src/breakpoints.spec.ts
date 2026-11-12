import { buildBreakpoints } from './breakpoints.ts';

describe('buildBreakpoints', () => {
    it('holds the desktop breakpoint in em', () => {
        expect(buildBreakpoints()).toContain('\n$breakpoint-desktop: 64em;\n');
    });
});
