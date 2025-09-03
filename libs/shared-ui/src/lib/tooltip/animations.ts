import { animate, state, style, transition, trigger } from '@angular/animations';

export const ShowHideAnimationStates = {
    HIDDEN: 'hidden',
    SHOWN: 'shown',
} as const;

export type ShowHideAnimationState = (typeof ShowHideAnimationStates)[keyof typeof ShowHideAnimationStates];

export const showHideAnimation = trigger('showHide', [
    state(`:enter, :leave, ${ShowHideAnimationStates.HIDDEN}`, style({ opacity: 0 })),
    state(ShowHideAnimationStates.SHOWN, style({ opacity: 1 })),
    transition(`${ShowHideAnimationStates.SHOWN} => *`, animate('100ms ease-out', style({ opacity: 0 }))),
    transition(`* => ${ShowHideAnimationStates.SHOWN}`, [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 })),
    ]),
]);
