import { InjectionToken } from '@angular/core';

export const TOOLTIP_SHOW_DELAY_MS = 500;

export const TOOLTIP_HIDE_DELAY_MS = 200;

export const TOOLTIP_HIDE_DELAY_ANIMATION_DELAY_MS = 150;

export interface TooltipDelays {
    showDelay: number;
    hideDelay: number;
    hideAnimationDelay: number;
}

export const TOOLTIP_TIMINGS = new InjectionToken<TooltipDelays>('Tooltip delay timings', {
    providedIn: 'root',
    factory: () => ({
        showDelay: TOOLTIP_SHOW_DELAY_MS,
        hideDelay: TOOLTIP_HIDE_DELAY_MS,
        hideAnimationDelay: TOOLTIP_HIDE_DELAY_ANIMATION_DELAY_MS,
    }),
});
