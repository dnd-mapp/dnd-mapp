import { join } from 'path';

export const baseIconsPath = join(__dirname, 'assets', 'images', 'favicon');

export const getIconOfSize = (size: string) => join(baseIconsPath, `${size}.png`);

export const DEFAULT_ICON_PATH = getIconOfSize('32x32');
