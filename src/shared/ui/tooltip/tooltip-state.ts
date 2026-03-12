export const TooltipStates = {
    HIDING: 'hiding',
    HIDDEN: 'hidden',
    SHOWING: 'showing',
    SHOWN: 'shown',
} as const;

export type TooltipState = (typeof TooltipStates)[keyof typeof TooltipStates];
