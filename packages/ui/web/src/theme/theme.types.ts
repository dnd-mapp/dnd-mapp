/**
 * The color scheme that the reader picks. System follows the `prefers-color-scheme` of the device, and Dark and Light
 * override it.
 */
export const Theme = {
    System: 'system',
    Dark: 'dark',
    Light: 'light',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

export const DEFAULT_THEME: Theme = Theme.System;

/**
 * The `localStorage` key that holds a choice of Dark or Light. The boot script in the `index.html` of the web app reads
 * the same key, which `boot-script.spec.ts` checks.
 */
export const THEME_STORAGE_KEY = 'dma-theme';

/** The attribute on `<html>` that `tokens.css` reads to pick Dark or Light over the color scheme of the device. */
export const THEME_ATTRIBUTE = 'data-theme';

/** Passes a valid theme through, and turns any other value, such as a missing or hand-edited one, into System. */
export function parseTheme(value: string | null): Theme {
    return Object.values<string | null>(Theme).includes(value) ? (value as Theme) : DEFAULT_THEME;
}
