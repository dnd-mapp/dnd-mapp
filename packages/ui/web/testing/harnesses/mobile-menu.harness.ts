import { ComponentHarness, HarnessPredicate, type TestElement } from '@angular/cdk/testing';
import { ButtonHarness } from './button.harness';
import { LogoHarness } from './logo.harness';
import { NavLinkHarness } from './nav-link.harness';
import { ThemePickerHarness } from './theme-picker.harness';

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

/** A part of the body of a mobile menu: the body itself, the nav, the GitHub button, or the Theme part. */
export type MobileMenuBodyPart = 'body' | 'nav' | 'github' | 'theme' | 'themeTitle' | 'themePicker';

/** The selectors of the parts of the body, relative to the menu. */
const BODY_PART_SELECTORS: Record<MobileMenuBodyPart, string> = {
    body: '.body',
    nav: '.body > nav',
    github: '.body > a[dma-button]',
    theme: '.body > .theme',
    themeTitle: '.body > .theme > .title',
    themePicker: '.body > .theme > [dma-theme-picker]',
};

/** How a mobile menu draws the divider below its nav. */
export interface MobileMenuDividerLook {
    color: string;
    width: string;
}

/** How a mobile menu draws the title above its Theme picker, and whether assistive technology skips it. */
export interface MobileMenuThemeTitleLook {
    color: string;
    fontSize: string;
    fontWeight: string;
    letterSpacing: string;
    textTransform: string;
    ariaHidden: string | null;
}

/** Where a mobile menu, or a part of it, sits in the viewport, and its size, in pixels. */
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
    private readonly navLinksLocator = this.locatorForAll(
        new HarnessPredicate(NavLinkHarness, { ancestor: BODY_PART_SELECTORS.nav }),
    );
    private readonly githubButtonLocator = this.locatorFor(
        new HarnessPredicate(ButtonHarness, { selector: BODY_PART_SELECTORS.github }),
    );
    private readonly themePickerLocator = this.locatorFor(ThemePickerHarness);
    private readonly navLinkElementsLocator = this.locatorForAll(`${BODY_PART_SELECTORS.nav} > a[dma-nav-link]`);

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

    /** The harnesses of the projected nav links in the nav, in their order. */
    public async getNavLinks(): Promise<NavLinkHarness[]> {
        return await this.navLinksLocator();
    }

    /** The harness of the projected GitHub button. */
    public async getGithubButton(): Promise<ButtonHarness> {
        return await this.githubButtonLocator();
    }

    /** The harness of the Theme picker at the bottom of the body. */
    public async getThemePicker(): Promise<ThemePickerHarness> {
        return await this.themePickerLocator();
    }

    /** How the menu draws the divider below its nav. */
    public async getDividerLook(): Promise<MobileMenuDividerLook> {
        const nav = await this.locatorFor(BODY_PART_SELECTORS.nav)();
        const [color, width] = await Promise.all([
            nav.getCssValue('border-bottom-color'),
            nav.getCssValue('border-bottom-width'),
        ]);

        return { color, width };
    }

    /** How the menu draws the title above its Theme picker. */
    public async getThemeTitleLook(): Promise<MobileMenuThemeTitleLook> {
        const title = await this.locatorFor(BODY_PART_SELECTORS.themeTitle)();
        const [color, fontSize, fontWeight, letterSpacing, textTransform, ariaHidden] = await Promise.all([
            title.getCssValue('color'),
            title.getCssValue('font-size'),
            title.getCssValue('font-weight'),
            title.getCssValue('letter-spacing'),
            title.getCssValue('text-transform'),
            title.getAttribute('aria-hidden'),
        ]);

        return { color, fontSize, fontWeight, letterSpacing, textTransform, ariaHidden };
    }

    /** Where `part` of the body sits, measured from the top left of the menu. */
    public async getBodyBox(part: MobileMenuBodyPart): Promise<MobileMenuBox> {
        return await this.getBoxOf(await this.locatorFor(BODY_PART_SELECTORS[part])());
    }

    /** Where each projected nav link sits, measured from the top left of the menu. */
    public async getNavLinkBoxes(): Promise<MobileMenuBox[]> {
        return await Promise.all((await this.navLinkElementsLocator()).map((link) => this.getBoxOf(link)));
    }

    private async getBoxOf(element: TestElement): Promise<MobileMenuBox> {
        const [menu, { top, left, width, height }] = await Promise.all([
            (await this.host()).getDimensions(),
            element.getDimensions(),
        ]);

        return { top: top - menu.top, left: left - menu.left, width, height };
    }
}
