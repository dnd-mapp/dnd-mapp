import { ConnectedPosition } from '@angular/cdk/overlay';

export const Positions = {
    ABOVE: 'above',
    AFTER: 'after',
    BEFORE: 'before',
    BELOW: 'below',
};

export type Position = (typeof Positions)[keyof typeof Positions];

export function positionAttribute(value: Position) {
    return Object.values(Positions).find((position) => position === value);
}

export const Orientations = {
    HORIZONTAL: 'horizontal',
    HORIZONTAL_REVERSE: 'horizontal-reverse',
    VERTICAL: 'vertical',
    VERTICAL_REVERSE: 'vertical-reverse',
};

export type Orientation = (typeof Orientations)[keyof typeof Orientations];

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export function orientationAttribute(value: Orientation | '') {
    return Object.values(Orientations).find((orientation) => value === orientation) ?? Orientations.VERTICAL;
}

export const POSITION_ABOVE: ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -4,
};

export const POSITION_BELOW: ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 4,
};

export const POSITION_BEFORE: ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -4,
};

export const POSITION_AFTER: ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 4,
};

export const VERTICAL_POSITIONS: ConnectedPosition[] = [POSITION_ABOVE, POSITION_BELOW];

export const HORIZONTAL_POSITIONS: ConnectedPosition[] = [POSITION_BEFORE, POSITION_AFTER];

export const DEFAULT_POSITIONS: ConnectedPosition[] = [...VERTICAL_POSITIONS, ...HORIZONTAL_POSITIONS];
