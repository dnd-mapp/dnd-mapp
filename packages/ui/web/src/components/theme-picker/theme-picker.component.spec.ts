import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ThemePickerComponent } from './theme-picker.component';
import { ThemePickerDisplay } from './theme-picker.types';
import { StorageKey } from '../../storage';
import { Theme, ThemeService } from '../../theme';
import {
    InMemoryStorage,
    provideBrowserStorage,
    setupTestEnvironment,
    ThemePickerHarness,
    type ThemePickerLook,
} from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the picker can only take each one from the token the test sets it on.
const BACKGROUND_SUNKEN = 'rgb(10, 20, 30)';
const BACKGROUND_RAISED = 'rgb(40, 50, 60)';
const BACKGROUND_HOVER = 'rgb(70, 80, 90)';
const BORDER_CONTROL = 'rgb(100, 110, 120)';
const BORDER_STRONG = 'rgb(130, 140, 150)';
const FOREGROUND_DEFAULT = 'rgb(20, 120, 40)';
const FOREGROUND_MUTED = 'rgb(90, 90, 200)';
const FOCUS_RING = 'rgb(0, 100, 250)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * Sets the semantic tokens that the picker reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-background-sunken: ${BACKGROUND_SUNKEN};
        --color-background-raised: ${BACKGROUND_RAISED};
        --color-background-hover: ${BACKGROUND_HOVER};
        --color-border-control: ${BORDER_CONTROL};
        --color-border-strong: ${BORDER_STRONG};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-default: 1px;
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --radius-sm: 8px;
        --radius-md: 10px;
        --size-icon-sm: 20px;
        --size-target-min: 44px;
        --space-4: 4px;
        --space-8: 8px;
        --space-12: 12px;
        --typography-nav-font-size: 15px;
        --typography-nav-line-height: 1.2;
        padding: 1rem;
    }
`;

/** How an option looks in each state, as Penpot draws it. Focus keeps the look of the state. */
const LOOKS: Record<'default' | 'hover' | 'selected', ThemePickerLook> = {
    default: { background: TRANSPARENT, borderColor: TRANSPARENT, color: FOREGROUND_MUTED },
    hover: { background: BACKGROUND_HOVER, borderColor: TRANSPARENT, color: FOREGROUND_DEFAULT },
    selected: { background: BACKGROUND_RAISED, borderColor: BORDER_STRONG, color: FOREGROUND_DEFAULT },
};

const NAMES: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };

describe('ThemePickerComponent', () => {
    @Component({
        template: `<div class="tokens"><fieldset dma-theme-picker></fieldset></div>`,
        styles: TOKENS,
        imports: [ThemePickerComponent],
    })
    class DefaultTestComponent {}

    @Component({
        template: `<div class="tokens"><fieldset dma-theme-picker [display]="display()"></fieldset></div>`,
        styles: TOKENS,
        imports: [ThemePickerComponent],
    })
    class TestComponent {
        public readonly display = signal<ThemePickerDisplay>(ThemePickerDisplay.Labels);
    }

    @Component({
        template: `
            <div class="tokens">
                <fieldset dma-theme-picker></fieldset>
                <fieldset dma-theme-picker display="icons"></fieldset>
            </div>
        `,
        styles: TOKENS,
        imports: [ThemePickerComponent],
    })
    class TwoPickersTestComponent {}

    interface SetupOptions {
        display?: ThemePickerDisplay;
        /** The value saved under the key of the theme before the picker starts. */
        saved?: Theme | undefined;
        /** Uses `localStorage`, since a `StorageEvent` accepts only a storage of the browser as its `storageArea`. */
        local?: boolean;
    }

    function radio(theme: Theme) {
        return page.getByRole('radio', { name: NAMES[theme], exact: true });
    }

    /**
     * The label of the option of `theme`, which a pointer clicks or hovers: the label draws the option over its hidden
     * radio input, so Playwright can't reach the input itself.
     */
    function option(theme: Theme) {
        const label = radio(theme).element().closest('label');

        if (!label) {
            throw new Error('The radio input has no label.');
        }
        return page.elementLocator(label);
    }

    async function setupTest(host: Type<unknown>, { display, saved, local = false }: SetupOptions = {}) {
        const storage = local ? localStorage : new InMemoryStorage();

        if (saved) {
            storage.setItem(StorageKey.Theme, saved);
        }
        const { fixture, harness, harnessLoader } = await setupTestEnvironment({
            host,
            harness: ThemePickerHarness,
            providers: [provideBrowserStorage(storage)],
        });

        if (display) {
            (fixture.componentInstance as TestComponent).display.set(display);
        }
        // Renders the display before a query of the page, which would otherwise find the picker as the host first
        // rendered it.
        TestBed.tick();

        const setTheme = vi.spyOn(TestBed.inject(ThemeService), 'setTheme');

        return { harness, harnessLoader, setTheme };
    }

    afterEach(() => {
        localStorage.removeItem(StorageKey.Theme);
        document.documentElement.removeAttribute('data-theme');
    });

    describe.each<ThemePickerDisplay>(Object.values(ThemePickerDisplay))('with display %s', (display) => {
        it('should be a group named Theme', async () => {
            await setupTest(TestComponent, { display });

            await expect.element(page.getByRole('group', { name: 'Theme', exact: true })).toBeInTheDocument();
        });

        it('should offer System, Light, and Dark as radio inputs named by their labels', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            expect(await harness.getThemes()).toEqual([Theme.System, Theme.Light, Theme.Dark]);
            for (const theme of Object.values(Theme)) {
                await expect.element(radio(theme)).toBeInTheDocument();
            }
        });

        it('should select System when nothing is saved', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            expect(await harness.getSelected()).toBe(Theme.System);
            await expect.element(radio(Theme.System)).toBeChecked();
        });

        it.each<Theme>([Theme.Light, Theme.Dark])('should select the saved %s', async (theme) => {
            const { harness } = await setupTest(TestComponent, { display, saved: theme });

            expect(await harness.getSelected()).toBe(theme);
        });

        it.each<Theme>([Theme.Light, Theme.Dark, Theme.System])(
            'should pass a click on %s to ThemeService',
            async (theme) => {
                const { harness, setTheme } = await setupTest(TestComponent, {
                    display,
                    saved: theme === Theme.System ? Theme.Dark : undefined,
                });

                await userEvent.click(option(theme));

                expect(setTheme).toHaveBeenCalledExactlyOnceWith(theme);
                expect(await harness.getSelected()).toBe(theme);
            },
        );

        it('should move the choice with the arrow keys', async () => {
            const { harness, setTheme } = await setupTest(TestComponent, { display });

            await userEvent.tab();
            await expect.element(radio(Theme.System)).toHaveFocus();

            await userEvent.keyboard('{ArrowRight}');
            await expect.element(radio(Theme.Light)).toHaveFocus();
            expect(setTheme).toHaveBeenLastCalledWith(Theme.Light);

            await userEvent.keyboard('{ArrowRight}');
            expect(setTheme).toHaveBeenLastCalledWith(Theme.Dark);

            await userEvent.keyboard('{ArrowLeft}');
            expect(setTheme).toHaveBeenLastCalledWith(Theme.Light);
            expect(await harness.getSelected()).toBe(Theme.Light);
        });

        it('should show a choice made in another tab', async () => {
            const { harness } = await setupTest(TestComponent, { display, local: true });

            window.dispatchEvent(
                new StorageEvent('storage', { key: StorageKey.Theme, newValue: Theme.Dark, storageArea: localStorage }),
            );
            TestBed.tick();

            expect(await harness.getSelected()).toBe(Theme.Dark);
        });

        it('should draw the picker around its options', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            const { background, borderColor } = await harness.getLook();

            expect({ background, borderColor }).toEqual({ background: BACKGROUND_SUNKEN, borderColor: BORDER_CONTROL });
            expect((await harness.getSize()).height).toBe(44);
        });

        it('should draw the selected option apart from the others', async () => {
            const { harness } = await setupTest(TestComponent, { display, saved: Theme.Light });

            expect(await harness.getOptionLook(Theme.Light)).toEqual(LOOKS.selected);
            expect(await harness.getOptionLook(Theme.System)).toEqual(LOOKS.default);
            expect(await harness.getOptionLook(Theme.Dark)).toEqual(LOOKS.default);
        });

        it('should draw its hover look on an option that is not selected', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            await userEvent.hover(option(Theme.Dark));
            const look = await harness.getOptionLook(Theme.Dark);
            await userEvent.unhover(option(Theme.Dark));

            expect(look).toEqual(LOOKS.hover);
        });

        it('should draw no focus ring until an option has focus', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            for (const theme of Object.values(Theme)) {
                expect((await harness.getFocusRing(theme)).style).toBe('none');
            }
        });

        it('should draw the focus ring outside the option on keyboard focus, and keep its look', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            await userEvent.tab();

            expect(await harness.getFocusRing(Theme.System)).toEqual({
                style: 'solid',
                color: FOCUS_RING,
                width: '2px',
                offset: '2px',
            });
            expect(await harness.getOptionLook(Theme.System)).toEqual(LOOKS.selected);
        });

        it('should draw each icon at 20 px', async () => {
            const { harness } = await setupTest(TestComponent, { display });

            for (const theme of Object.values(Theme)) {
                expect(await harness.getIconSize(theme)).toEqual({ width: 20, height: 20 });
            }
        });
    });

    it('should show each label in the labels display', async () => {
        const { harness } = await setupTest(TestComponent, { display: ThemePickerDisplay.Labels });

        for (const theme of Object.values(Theme)) {
            expect(await harness.isLabelShown(theme)).toBe(true);
            expect((await harness.getOptionSize(theme)).height).toBe(36);
        }
    });

    it('should show each icon alone in a 36 px square in the icons display', async () => {
        const { harness } = await setupTest(TestComponent, { display: ThemePickerDisplay.Icons });

        for (const theme of Object.values(Theme)) {
            expect(await harness.isLabelShown(theme)).toBe(false);
            expect(await harness.getOptionSize(theme)).toEqual({ width: 36, height: 36 });
        }
    });

    it('should show the labels display by default', async () => {
        const { harness } = await setupTest(DefaultTestComponent);

        expect(await harness.isLabelShown(Theme.System)).toBe(true);
    });

    it('should show the labels display for a display it does not know', async () => {
        const { harness } = await setupTest(TestComponent, { display: 'unknown' as ThemePickerDisplay });

        expect(await harness.isLabelShown(Theme.System)).toBe(true);
    });

    it('should group the options of each picker on a page apart', async () => {
        const { harnessLoader } = await setupTest(TwoPickersTestComponent);
        const pickers = await harnessLoader.getAllHarnesses(ThemePickerHarness);
        const names = await Promise.all(pickers.map(async (picker) => await picker.getName()));
        const selected = await Promise.all(pickers.map(async (picker) => await picker.getSelected()));

        expect(new Set(names).size).toBe(2);
        expect(selected).toEqual([Theme.System, Theme.System]);
    });
});
