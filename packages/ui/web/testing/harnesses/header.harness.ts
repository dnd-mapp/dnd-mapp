import { ComponentHarness, HarnessPredicate, type TestElement } from '@angular/cdk/testing';
import { ButtonHarness } from './button.harness';
import { LogoHarness } from './logo.harness';
import { NavLinkHarness } from './nav-link.harness';
import { ThemePickerHarness } from './theme-picker.harness';

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

/**
 * A part of a header: the projected link home, the nav around the projected nav links, the projected GitHub button,
 * the Theme picker, or the Menu button.
 */
export type HeaderPart = 'home' | 'nav' | 'github' | 'theme' | 'menu';

/** The selectors of the parts, relative to the header. */
const PART_SELECTORS: Record<HeaderPart, string> = {
    home: '.start > a',
    nav: '.start > nav',
    github: '.end > a[dma-button]',
    theme: '.end > fieldset[dma-theme-picker]',
    menu: '.end > .menu',
};

/** How far a part of a header sits from each edge of the header, in pixels. */
export interface HeaderPartInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export class HeaderHarness extends ComponentHarness {
    public static readonly hostSelector = 'header[dma-header]';

    private readonly homeLocator = this.locatorFor(PART_SELECTORS.home);
    private readonly menuLocator = this.locatorFor(PART_SELECTORS.menu);
    private readonly menuButtonLocator = this.locatorFor(new HarnessPredicate(ButtonHarness, { selector: '.menu' }));
    private readonly gitHubButtonLocator = this.locatorForOptional(
        new HarnessPredicate(ButtonHarness, { selector: PART_SELECTORS.github }),
    );
    private readonly logoLocator = this.locatorForOptional(LogoHarness);
    private readonly navLinksLocator = this.locatorForAll(NavLinkHarness);
    private readonly themePickerLocator = this.locatorFor(ThemePickerHarness);

    /** The logo inside the projected link home, or null when the header holds none. */
    public async getLogo(): Promise<LogoHarness | null> {
        return await this.logoLocator();
    }

    /** The projected nav links, in the order the header shows them. */
    public async getNavLinks(): Promise<NavLinkHarness[]> {
        return await this.navLinksLocator();
    }

    /** The projected GitHub button, or null when the header holds none. */
    public async getGitHubButton(): Promise<ButtonHarness | null> {
        return await this.gitHubButtonLocator();
    }

    /** The harness of the Theme picker. */
    public async getThemePicker(): Promise<ThemePickerHarness> {
        return await this.themePickerLocator();
    }

    /** Whether the current layout shows `part`, which it otherwise also hides from assistive technology. */
    public async isShown(part: HeaderPart): Promise<boolean> {
        return (await (await this.locatorFor(PART_SELECTORS[part])()).getCssValue('display')) !== 'none';
    }

    /** The value of an attribute of the nav around the nav links, or null when it has none. */
    public async getNavAttribute(name: string): Promise<string | null> {
        return await (await this.locatorFor(PART_SELECTORS.nav)()).getAttribute(name);
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
        const element: TestElement = await this.locatorFor(PART_SELECTORS[part])();
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
