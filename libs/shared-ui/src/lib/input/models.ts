import { animate, state, style, transition, trigger } from '@angular/animations';

export const InputTypes = {
    TEXT: 'text',
    PASSWORD: 'password',
    EMAIL: 'email',
} as const;

export type InputType = (typeof InputTypes)[keyof typeof InputTypes];

export function inputTypeAttribute(value: unknown): InputType {
    return Object.values(InputTypes).find((inputType) => inputType === value) ?? InputTypes.TEXT;
}

export const FloatingLabelAnimationStates = {
    DEFAULT: 'default',
    FLOATING: 'floating',
    FLOATING_LEADING_ICON: 'floating-leading-icon',
} as const;

export type FloatingLabelAnimationState =
    (typeof FloatingLabelAnimationStates)[keyof typeof FloatingLabelAnimationStates];

export const floatingLabelAnimation = trigger('floatingLabel', [
    state(FloatingLabelAnimationStates.DEFAULT, style('*')),
    state(
        FloatingLabelAnimationStates.FLOATING,
        style({
            fontSize: '0.8rem',
            top: '-1rem',
            paddingTop: '0',
            paddingBottom: '0',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
        })
    ),
    state(
        FloatingLabelAnimationStates.FLOATING_LEADING_ICON,
        style({
            fontSize: '0.8rem',
            top: '-0.5rem',
            left: '-0.5rem',
            paddingTop: '0',
            paddingBottom: '0',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
        })
    ),
    transition(`void => *`, animate('0ms')),
    transition(`${FloatingLabelAnimationStates.DEFAULT} => ${FloatingLabelAnimationStates.FLOATING}`, [
        animate('250ms ease-in-out'),
    ]),
    transition(`${FloatingLabelAnimationStates.DEFAULT} => ${FloatingLabelAnimationStates.FLOATING_LEADING_ICON}`, [
        animate('250ms ease-in-out'),
    ]),
    transition(`* => ${FloatingLabelAnimationStates.DEFAULT}`, [animate('100ms ease-in-out')]),
]);

export const AutocompleteTypes = {
    USERNAME: 'username',
    PASSWORD: 'password',
    CURRENT_PASSWORD: 'current-password',
    NEW_PASSWORD: 'new-password',
    EMAIL: 'email',
    OFF: 'off',
} as const;

export type AutocompleteType = (typeof AutocompleteTypes)[keyof typeof AutocompleteTypes];

export function autocompleteAttribute(value: unknown): AutocompleteType {
    return (
        Object.values(AutocompleteTypes).find((autocompleteType) => autocompleteType === value) ?? AutocompleteTypes.OFF
    );
}

export type ErrorMap = Record<string, (...args: unknown[]) => string>;
