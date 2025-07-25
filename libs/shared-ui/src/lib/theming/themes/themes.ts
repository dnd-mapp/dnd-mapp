import { DarkTheme } from './dark.theme';
import { LightTheme } from './light.theme';
import { Theme, ThemeName, ThemeNames } from './models';

export const Themes: Record<ThemeName, Theme> = {
    [ThemeNames.DARK]: DarkTheme,
    [ThemeNames.LIGHT]: LightTheme,
} as const;
