/**
 * The keys that the web app saves under in `BROWSER_STORAGE`. `StorageService` takes no other key, so a misspelled key
 * fails to compile and no two features can share one. Add the key here before you save under it.
 */
export const StorageKey = {
    /** The theme that the reader picked. The boot script in the `index.html` of the web app reads it too. */
    Theme: 'dma-theme',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
