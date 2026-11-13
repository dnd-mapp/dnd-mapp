import { ComponentHarness } from '@angular/cdk/testing';

/** The glyphs of the Icon component, each of which has a component of its own named `dma-icon-<glyph>`. */
const GLYPHS = [
    'menu',
    'close',
    'arrow-right',
    'arrow-down',
    'plus',
    'minus',
    'external',
    'sun',
    'moon',
    'monitor',
    'check',
    'github',
];

export class IconHarness extends ComponentHarness {
    public static readonly hostSelector = GLYPHS.map((glyph) => `dma-icon-${glyph}`).join(', ');

    private readonly svgLocator = this.locatorFor('svg');

    /** The glyph the icon draws, read from the name of its element. */
    public async getGlyph(): Promise<string> {
        const tagName = await (await this.host()).getProperty<string>('tagName');

        return tagName.toLowerCase().replace(/^dma-icon-/, '');
    }

    /** Whether the icon is hidden from assistive technology, so the control that holds it names itself. */
    public async isHidden(): Promise<boolean> {
        return (await (await this.host()).getAttribute('aria-hidden')) === 'true';
    }

    /** The color the icon draws with: the stroke of a stroked glyph, or the fill of a filled one. */
    public async getColor(): Promise<string> {
        const svg = await this.svgLocator();
        const stroke = await svg.getCssValue('stroke');

        return stroke === 'none' ? await svg.getCssValue('fill') : stroke;
    }

    /** The width and height of the icon in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }
}
