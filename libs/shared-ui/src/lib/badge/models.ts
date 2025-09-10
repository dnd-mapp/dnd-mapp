export const MAX_BADGE_COUNT = 999 as const;

export const BadgeTypes = {
    SMALL: 'small',
    LARGE: 'large',
} as const;

export type BadgeType = (typeof BadgeTypes)[keyof typeof BadgeTypes];

export const DEFAULT_BADGE_TYPE: BadgeType = BadgeTypes.SMALL;

export function badgeTypeAttribute(value: unknown) {
    return Object.values(BadgeTypes).find((type) => type === value) ?? DEFAULT_BADGE_TYPE;
}
