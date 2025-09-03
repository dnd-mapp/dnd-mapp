import { ConnectedPosition } from '@angular/cdk/overlay';

const TooltipOrientations = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
} as const;

export type TooltipOrientation = (typeof TooltipOrientations)[keyof typeof TooltipOrientations];

export function tooltipOrientationAttribute(value: TooltipOrientation) {
    return Object.values(TooltipOrientations).find((orientation) => value === orientation) ?? null;
}

export const HorizontalPositions = {
    START: 'start',
    END: 'end',
} as const;

export const VerticalPositions = {
    TOP: 'top',
    BOTTOM: 'bottom',
} as const;

export const TooltipPositions = {
    ...HorizontalPositions,
    ...VerticalPositions,
} as const;

export type TooltipPosition = (typeof TooltipPositions)[keyof typeof TooltipPositions];

export function tooltipPositionAttribute(value: TooltipPosition) {
    return Object.values(TooltipPositions).find((position) => position === value) ?? null;
}

const tooltipPositionStart: ConnectedPosition = {
    overlayX: 'end',
    overlayY: 'center',
    originX: 'start',
    originY: 'center',
    panelClass: ['dma-tooltip-start'],
};

const tooltipPositionEnd: ConnectedPosition = {
    overlayX: 'start',
    overlayY: 'center',
    originX: 'end',
    originY: 'center',
    panelClass: ['dma-tooltip-end'],
};

const tooltipPositionTop: ConnectedPosition = {
    overlayX: 'center',
    overlayY: 'bottom',
    originX: 'center',
    originY: 'top',
    panelClass: ['dma-tooltip-top'],
};

const tooltipPositionBottom: ConnectedPosition = {
    overlayX: 'center',
    overlayY: 'top',
    originX: 'center',
    originY: 'center',
    panelClass: ['dma-tooltip-bottom'],
};

const verticalPositionConfigurations = [tooltipPositionTop, tooltipPositionBottom];

const horizontalPositionConfigurations = [tooltipPositionStart, tooltipPositionEnd];

const defaultPositionConfiguration = [...verticalPositionConfigurations, ...horizontalPositionConfigurations];

export const isHorizontalPosition = (value: TooltipPosition) =>
    Object.values(HorizontalPositions).some((position) => position === value);

export const isVerticalPosition = (value: TooltipPosition) =>
    Object.values(VerticalPositions).some((position) => position === value);

export function buildTooltipPositions(orientation: TooltipOrientation, position?: TooltipPosition) {
    if (position) {
        if (
            (orientation === 'horizontal' && isVerticalPosition(position)) ||
            (orientation === 'vertical' && isHorizontalPosition(position))
        ) {
            throw new Error(
                `Invalid Tooltip Position "${position}" and Tooltip orientation "${orientation}" combination`
            );
        }
        switch (position) {
            case 'top':
                return [...verticalPositionConfigurations];
            case 'bottom':
                return [...verticalPositionConfigurations].reverse();
            case 'start':
                return [...horizontalPositionConfigurations];
            case 'end':
                return [...horizontalPositionConfigurations].reverse();
        }
    }
    return orientation === 'horizontal'
        ? [...horizontalPositionConfigurations, ...verticalPositionConfigurations]
        : [...defaultPositionConfiguration];
}
