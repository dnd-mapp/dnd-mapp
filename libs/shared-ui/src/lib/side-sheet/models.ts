export const VisibilityStates = {
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
} as const;

export type VisibilityState = (typeof VisibilityStates)[keyof typeof VisibilityStates];
