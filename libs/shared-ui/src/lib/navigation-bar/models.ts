/** Padding on the start and end of the NavigationBar in em */
export const NAVIGATION_BAR_PADDING = 2.5 as const;

export const NavigationBarLayouts = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
} as const;

export type NavigationBarLayout = (typeof NavigationBarLayouts)[keyof typeof NavigationBarLayouts];

export const DEFAULT_NAVIGATION_BAR_LAYOUT: NavigationBarLayout = NavigationBarLayouts.VERTICAL;

export function navigationBarLayoutAttribute(value: unknown) {
    return Object.values(NavigationBarLayouts).find((layout) => layout === value) ?? DEFAULT_NAVIGATION_BAR_LAYOUT;
}
