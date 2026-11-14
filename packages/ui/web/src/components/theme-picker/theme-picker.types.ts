/** How the theme picker shows its options: each icon with its label, or the icons alone where space is tight. */
export const ThemePickerDisplay = {
    Labels: 'labels',
    Icons: 'icons',
} as const;

export type ThemePickerDisplay = (typeof ThemePickerDisplay)[keyof typeof ThemePickerDisplay];

export const DEFAULT_THEME_PICKER_DISPLAY: ThemePickerDisplay = ThemePickerDisplay.Labels;

/** Passes a valid display through, and turns any other value into the default display. */
export function themePickerDisplayAttr(value: ThemePickerDisplay): ThemePickerDisplay {
    return Object.values(ThemePickerDisplay).includes(value) ? value : DEFAULT_THEME_PICKER_DISPLAY;
}
