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
} from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the picker can only take each one from the token the test sets it on.
const BACKGROUND_SUNKEN = 'rgb(10, 20, 30)';
const BORDER_CONTROL = 'rgb(100, 110, 120)';

/**
 * Sets the semantic tokens that the picker and its options read to values of the test, rather than loading
 * `tokens.css`, so each expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-background-sunken: ${BACKGROUND_SUNKEN};
        --color-border-control: ${BORDER_CONTROL};
        --border-width-default: 1px;
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
     * The label of the option of `theme`, which a pointer clicks: the label draws the option over its hidden radio
     * input, so Playwright can't reach the input itself.
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

        it('should pass its display to each option', async () => {
            const { harness } = await setupTest(TestComponent, { display });
            const options = await harness.getOptions();
            const shown = await Promise.all(options.map(async (option) => await option.isLabelShown()));
            const labelsShown = display === ThemePickerDisplay.Labels;

            expect(shown).toEqual([labelsShown, labelsShown, labelsShown]);
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

            expect(await harness.getLook()).toEqual({ background: BACKGROUND_SUNKEN, borderColor: BORDER_CONTROL });
            expect((await harness.getSize()).height).toBe(44);
        });
    });

    it('should show the labels display by default', async () => {
        const { harness } = await setupTest(DefaultTestComponent);

        expect(await (await harness.getOption(Theme.System)).isLabelShown()).toBe(true);
    });

    it('should show the labels display for a display it does not know', async () => {
        const { harness } = await setupTest(TestComponent, { display: 'unknown' as ThemePickerDisplay });

        expect(await (await harness.getOption(Theme.System)).isLabelShown()).toBe(true);
    });

    it('should group the options of each picker on a page apart', async () => {
        const { harnessLoader } = await setupTest(TwoPickersTestComponent);
        const pickers = await harnessLoader.getAllHarnesses(ThemePickerHarness);
        const names = await Promise.all(pickers.map(async (picker) => await picker.getNames()));
        const selected = await Promise.all(pickers.map(async (picker) => await picker.getSelected()));

        expect(names.map((group) => new Set(group).size)).toEqual([1, 1]);
        expect(new Set(names.flat()).size).toBe(2);
        expect(selected).toEqual([Theme.System, Theme.System]);
    });
});
