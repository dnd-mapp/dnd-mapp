import { TOOLTIP_TIMINGS, TooltipDelays } from '@/common';
import { ValueProvider } from '@angular/core';

export function provideTooltipDelayTesting(): ValueProvider {
    return {
        provide: TOOLTIP_TIMINGS,
        useValue: {
            showDelay: 0,
            hideDelay: 0,
            hideAnimationDelay: 0,
        } as TooltipDelays,
    };
}
