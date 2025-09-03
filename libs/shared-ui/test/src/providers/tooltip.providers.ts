import { ValueProvider } from '@angular/core';
import { TOOLTIP_DELAYS, TooltipDelays } from '@dnd-mapp/shared-ui/utils';

export const provideTestingTooltipDelays: () => ValueProvider = () => ({
    provide: TOOLTIP_DELAYS,
    useValue: {
        show: 0,
        hide: 0,
    } satisfies TooltipDelays,
});
