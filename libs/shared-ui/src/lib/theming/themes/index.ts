import { ThemeNames, Themes } from '../theme';
import { dark } from './dark';
import { light } from './light';

export const themes: Themes = {
    [ThemeNames.LIGHT]: light,
    [ThemeNames.DARK]: dark,
};
