/** How a nav link looks: in the bar of the header, as wide as its label. */
export const NavLinkKind = {
    Bar: 'bar',
} as const;

export type NavLinkKind = (typeof NavLinkKind)[keyof typeof NavLinkKind];

export const DEFAULT_NAV_LINK_KIND: NavLinkKind = NavLinkKind.Bar;

/** Passes a valid kind through, and turns any other value into the default kind. */
export function navLinkKindAttr(value: NavLinkKind): NavLinkKind {
    return Object.values(NavLinkKind).includes(value) ? value : DEFAULT_NAV_LINK_KIND;
}
