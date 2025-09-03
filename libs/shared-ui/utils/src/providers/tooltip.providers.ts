import { InjectionToken } from '@angular/core';

export interface TooltipDelays {
    show: number;
    hide: number;
}

export const TOOLTIP_DELAYS = new InjectionToken<TooltipDelays>('Tooltip delays');
