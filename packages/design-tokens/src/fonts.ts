/** A style of a font family, which Fontsource ships in a CSS file of its own. */
export type FontStyle = 'italic' | 'normal';

/** A local font whose metrics `@capsizecss/metrics` holds, so a fallback face can match it. */
export type FallbackFont = 'Arial' | 'Courier New';

/** A font family that `fonts.css` loads, and that `tokens.css` writes a stack for. */
export interface FontFamily {
    /** The name of the family, as the `fontFamilies` tokens in Penpot name it, such as `Source Sans 3`. */
    family: string;
    /** The Fontsource package of its variable font, which the package lists under `dependencies`. */
    package: string;
    /** The styles to load. Fontsource ships `normal` in `wght.css` and `italic` in `wght-italic.css`. */
    styles: readonly FontStyle[];
    /** The local font that the fallback face takes, scaled to the metrics of the family. */
    fallback: FallbackFont;
    /** The generic family that ends the stack, for a device without the fallback font. */
    generic: 'monospace' | 'sans-serif' | 'serif';
}

/** The families of the `font.family` tokens, as ADR 0010 records. Manrope has no italic. */
export const fonts: readonly FontFamily[] = [
    {
        family: 'Manrope',
        package: '@fontsource-variable/manrope',
        styles: ['normal'],
        fallback: 'Arial',
        generic: 'sans-serif',
    },
    {
        family: 'Source Sans 3',
        package: '@fontsource-variable/source-sans-3',
        styles: ['normal', 'italic'],
        fallback: 'Arial',
        generic: 'sans-serif',
    },
    {
        family: 'JetBrains Mono',
        package: '@fontsource-variable/jetbrains-mono',
        styles: ['normal', 'italic'],
        fallback: 'Courier New',
        generic: 'monospace',
    },
];

/**
 * Names the fallback face of a family, which `fonts.css` declares and the stack lists after the family.
 * @param font - The family to name the fallback of.
 * @returns The family name of its fallback face, such as `Source Sans 3 Fallback`.
 */
export function fallbackFamily(font: FontFamily): string {
    return `${font.family} Fallback`;
}

/**
 * Writes the font stack of a family, as a `fontFamilies` token holds it in `tokens.css`.
 * @param family - The family that the token names.
 * @param families - The families to look the name up in.
 * @returns The stack, such as `'Source Sans 3', 'Source Sans 3 Fallback', sans-serif`.
 */
export function fontStack(family: string, families: readonly FontFamily[] = fonts): string {
    const font = families.find((candidate) => candidate.family === family);

    if (font === undefined) {
        throw new Error(`No font in src/fonts.ts has the family ${family}. Add it, so fonts.css loads it.`);
    }
    return `'${font.family}', '${fallbackFamily(font)}', ${font.generic}`;
}
