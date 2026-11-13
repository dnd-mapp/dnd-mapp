/** What the logo shows: the mark with the wordmark, or the mark alone where space is short. */
export const LogoKind = {
    Full: 'full',
    Mark: 'mark',
} as const;

export type LogoKind = (typeof LogoKind)[keyof typeof LogoKind];

export const DEFAULT_LOGO_KIND: LogoKind = LogoKind.Full;

/** Passes a valid kind through, and turns any other value into the default kind. */
export function logoKindAttr(value: LogoKind): LogoKind {
    return Object.values(LogoKind).includes(value) ? value : DEFAULT_LOGO_KIND;
}

/** How large the logo draws: large for headers, small for menus and footers. */
export const LogoSize = {
    Large: 'large',
    Small: 'small',
} as const;

export type LogoSize = (typeof LogoSize)[keyof typeof LogoSize];

export const DEFAULT_LOGO_SIZE: LogoSize = LogoSize.Large;

/** Passes a valid size through, and turns any other value into the default size. */
export function logoSizeAttr(value: LogoSize): LogoSize {
    return Object.values(LogoSize).includes(value) ? value : DEFAULT_LOGO_SIZE;
}
