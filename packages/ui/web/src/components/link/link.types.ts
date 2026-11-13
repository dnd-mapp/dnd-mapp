/**
 * How a link looks: inline in a line of text, standalone on a line of its own with an arrow, or quiet in a list of
 * links, such as in a footer.
 */
export const LinkKind = {
    Inline: 'inline',
    Standalone: 'standalone',
    Quiet: 'quiet',
} as const;

export type LinkKind = (typeof LinkKind)[keyof typeof LinkKind];

export const DEFAULT_LINK_KIND: LinkKind = LinkKind.Inline;

/** Passes a valid kind through, and turns any other value into the default kind. */
export function linkKindAttr(value: LinkKind): LinkKind {
    return Object.values(LinkKind).includes(value) ? value : DEFAULT_LINK_KIND;
}
