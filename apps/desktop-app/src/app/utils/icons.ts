import { NativeImage, nativeImage } from 'electron';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { ASSETS_PATH } from '../file-system';

const baseIconsPath = join(ASSETS_PATH, 'images', 'favicon');

export function getIconOfSize(size: string) {
    return join(baseIconsPath, `${size}.png`);
}

const ScaleFactorsAndSizes = {
    '1': [16, 32],
    '1.25': [20, 40],
    '1.5': [24, 48],
    '2': [32, 64],
    '': [256],
} as const;

let icon: NativeImage;

async function addIconRepresentation(icon: NativeImage, size: number, scaleFactor: number) {
    icon.addRepresentation({
        buffer: await readFile(getIconOfSize(`${size}x${size}`)),
        width: size,
        height: size,
        ...(scaleFactor === 0 ? {} : { scaleFactor: scaleFactor }),
    });
}

export async function getIcon() {
    if (icon) return icon;
    icon = nativeImage.createEmpty();

    await Promise.all(
        Object.entries(ScaleFactorsAndSizes)
            .map(([scaleFactor, sizes]) => sizes.map((size) => addIconRepresentation(icon, size, Number(scaleFactor))))
            .flat()
    );

    return icon;
}
