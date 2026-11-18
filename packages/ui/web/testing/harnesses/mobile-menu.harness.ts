import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { ButtonHarness } from './button.harness';
import { LogoHarness } from './logo.harness';

/** How a mobile menu draws its panel. */
export interface MobileMenuLook {
    background: string;
    color: string;
    borderWidth: string;
}

/** How the bar at the top of a mobile menu draws its divider, and its height in pixels. */
export interface MobileMenuBarLook {
    dividerColor: string;
    dividerWidth: string;
    height: number;
}

/** A part of the bar of a mobile menu: the projected link home, or the Close button. */
export type MobileMenuBarPart = 'home' | 'close';

/** The selectors of the parts of the bar, relative to the menu. */
const BAR_PART_SELECTORS: Record<MobileMenuBarPart, string> = {
    home: '.bar > a',
    close: '.bar > .close',
};

/** Where a mobile menu sits in the viewport, and its size, in pixels. */
export interface MobileMenuBox {
    top: number;
    left: number;
    width: number;
    height: number;
}

/** How far a part of the bar of a mobile menu sits from each edge of the menu, in pixels. */
export interface MobileMenuBarPartInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class MobileMenuHarness extends ComponentHarness {
    public static readonly hostSelector = 'dialog[dma-mobile-menu]';

    private readonly barLocator = this.locatorFor('.bar');
    private readonly closeLocator = this.locatorFor(BAR_PART_SELECTORS.close);
    private readonly closeButtonLocator = this.locatorFor(
        new HarnessPredicate(ButtonHarness, { selector: BAR_PART_SELECTORS.close }),
    );
    private readonly logoLocator = this.locatorForOptional(LogoHarness);

    /** Whether the menu is open. */
    public async isOpen(): Promise<boolean> {
        return await (await this.host()).getProperty<boolean>('open');
    }

    /** Whether the menu is open as a modal dialog, which makes the rest of the page inert. */
    public async isModal(): Promise<boolean> {
        return await (await this.host()).matchesSelector(':modal');
    }

    /** The logo inside the projected link home, or null when the menu holds none. */
    public async getLogo(): Promise<LogoHarness | null> {
        return await this.logoLocator();
    }

    /** The harness of the Close button. */
    public async getCloseButton(): Promise<ButtonHarness> {
        return await this.closeButtonLocator();
    }

    /** Presses the Close button with the pointer. */
    public async pressClose(): Promise<void> {
        await (await this.closeLocator()).click();
    }

    /** How the menu draws its panel. */
    public async getLook(): Promise<MobileMenuLook> {
        const host = await this.host();
        const [background, color, borderWidth] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('color'),
            host.getCssValue('border-top-width'),
        ]);

        return { background, color, borderWidth };
    }

    /** Where the menu sits in the viewport, and its size, in pixels. */
    public async getBox(): Promise<MobileMenuBox> {
        const { top, left, width, height } = await (await this.host()).getDimensions();

        return { top, left, width, height };
    }

    /** How the bar draws its divider, and its height. */
    public async getBarLook(): Promise<MobileMenuBarLook> {
        const bar = await this.barLocator();
        const [dividerColor, dividerWidth, { height }] = await Promise.all([
            bar.getCssValue('border-bottom-color'),
            bar.getCssValue('border-bottom-width'),
            bar.getDimensions(),
        ]);

        return { dividerColor, dividerWidth, height };
    }

    /** The lines the link home draws under or over its text, such as `underline`, or `none`. */
    public async getHomeTextDecoration(): Promise<string> {
        return await (await this.locatorFor(BAR_PART_SELECTORS.home)()).getCssValue('text-decoration-line');
    }

    /** How far `part` of the bar sits from each edge of the menu. */
    public async getBarInsets(part: MobileMenuBarPart): Promise<MobileMenuBarPartInsets> {
        const [menu, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            (await this.locatorFor(BAR_PART_SELECTORS[part])()).getDimensions(),
        ]);

        return {
            top: top - menu.top,
            right: menu.left + menu.width - (left + width),
            bottom: menu.top + menu.height - (top + height),
            left: left - menu.left,
        };
    }
}
