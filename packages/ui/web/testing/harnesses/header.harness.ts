import { ComponentHarness, HarnessPredicate, type TestElement } from '@angular/cdk/testing';
import { ButtonHarness } from './button.harness';
import { LogoHarness } from './logo.harness';

/** How a header draws its box and its divider. */
export interface HeaderLook {
    background: string;
    dividerColor: string;
    dividerWidth: string;
}

/** The focus ring the link home draws, read from its outline. */
export interface HeaderHomeFocusRing {
    style: string;
    color: string;
    width: string;
    offset: string;
}

/** A part of a header: the projected link home, or the Menu button. */
export type HeaderPart = 'home' | 'menu';

/** How far a part of a header sits from each edge of the header, in pixels. */
export interface HeaderPartInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class HeaderHarness extends ComponentHarness {
    public static readonly hostSelector = 'header[dma-header]';

    private readonly homeLocator = this.locatorFor(':scope > a:not([dma-button])');
    private readonly menuLocator = this.locatorFor('button.menu');
    private readonly menuButtonLocator = this.locatorFor(new HarnessPredicate(ButtonHarness, { selector: '.menu' }));
    private readonly logoLocator = this.locatorForOptional(LogoHarness);

    /** The logo inside the projected link home, or null when the header holds none. */
    public async getLogo(): Promise<LogoHarness | null> {
        return await this.logoLocator();
    }

    /** The harness of the Menu button. */
    public async getMenuButton(): Promise<ButtonHarness> {
        return await this.menuButtonLocator();
    }

    /** Presses the Menu button with the pointer. */
    public async pressMenu(): Promise<void> {
        await (await this.menuLocator()).click();
    }

    /** The value of an attribute of the Menu button, or null when it has none. */
    public async getMenuAttribute(name: string): Promise<string | null> {
        return await (await this.menuLocator()).getAttribute(name);
    }

    /** How the header draws its box and its divider. */
    public async getLook(): Promise<HeaderLook> {
        const host = await this.host();
        const [background, dividerColor, dividerWidth] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-bottom-color'),
            host.getCssValue('border-bottom-width'),
        ]);

        return { background, dividerColor, dividerWidth };
    }

    /** The lines the link home draws under or over its text, such as `underline`, or `none`. */
    public async getHomeTextDecoration(): Promise<string> {
        return await (await this.homeLocator()).getCssValue('text-decoration-line');
    }

    /** The focus ring the link home draws, whose style is `none` when it draws none. */
    public async getHomeFocusRing(): Promise<HeaderHomeFocusRing> {
        const home = await this.homeLocator();
        const [style, color, width, offset] = await Promise.all([
            home.getCssValue('outline-style'),
            home.getCssValue('outline-color'),
            home.getCssValue('outline-width'),
            home.getCssValue('outline-offset'),
        ]);

        return { style, color, width, offset };
    }

    /** The width and height of the header in pixels. */
    public async getSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** How far `part` sits from each edge of the header. */
    public async getInsets(part: HeaderPart): Promise<HeaderPartInsets> {
        const element: TestElement = part === 'home' ? await this.homeLocator() : await this.menuLocator();
        const [header, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return {
            top: top - header.top,
            right: header.left + header.width - (left + width),
            bottom: header.top + header.height - (top + height),
            left: left - header.left,
        };
    }
}
