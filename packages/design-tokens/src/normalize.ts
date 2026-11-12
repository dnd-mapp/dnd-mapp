import { isToken, type TokenGroup } from './sets.ts';

/** The DTCG name of each typography property that Penpot exports under its Tokens Studio name. */
const propertyNames: Readonly<Record<string, string>> = {
    fontFamilies: 'fontFamily',
    fontSizes: 'fontSize',
    fontWeights: 'fontWeight',
    lineHeights: 'lineHeight',
};

/**
 * Prepares the tokens of a tree for Style Dictionary, which reads two parts of Penpot's export differently from how
 * the CSS needs them:
 *
 * - Penpot exports the properties of a typography token under their Tokens Studio names, so Style Dictionary would
 *   expand `typography.h1` into `typography.h1.fontSizes`. The properties get their DTCG names instead.
 * - Penpot exports each font family as a list. Style Dictionary resolves a reference to a list while it expands a
 *   typography token, which would write the font name in place of `var()`. A list of one font becomes that font.
 * @param tree - The token tree to change in place.
 */
export function normalizeTokens(tree: TokenGroup): void {
    for (const node of Object.values(tree)) {
        if (!isToken(node)) {
            normalizeTokens(node);
        } else if (node.$type === 'fontFamilies') {
            node.$value = unwrap(node.$value);
        } else if (node.$type === 'typography' && typeof node.$value === 'object' && node.$value !== null) {
            node.$value = Object.fromEntries(
                Object.entries(node.$value).map(([property, value]) => [
                    propertyNames[property] ?? property,
                    property === 'fontFamilies' ? unwrap(value) : value,
                ]),
            );
        }
    }
}

function unwrap(value: unknown): unknown {
    return Array.isArray(value) && value.length === 1 ? (value[0] as unknown) : value;
}
