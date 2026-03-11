export const StorageKeys = {
    NAV_RAIL_COLLAPSED: 'nav_rail_collapsed',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
