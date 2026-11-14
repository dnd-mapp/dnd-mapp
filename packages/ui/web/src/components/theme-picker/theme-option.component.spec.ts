import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ThemeOptionComponent } from './theme-option.component';
import { ThemePickerDisplay } from './theme-picker.types';
import { Theme } from '../../theme';
import { IconHarness, setupTestEnvironment, ThemeOptionHarness, type ThemeOptionLook } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the option can only take each one from the token the test sets it on.
const BACKGROUND_RAISED = 'rgb(40, 50, 60)';
const BACKGROUND_HOVER = 'rgb(70, 80, 90)';
const BORDER_STRONG = 'rgb(130, 140, 150)';
const FOREGROUND_DEFAULT = 'rgb(20, 120, 40)';
const FOREGROUND_MUTED = 'rgb(90, 90, 200)';
const FOCUS_RING = 'rgb(0, 100, 250)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * Sets the semantic tokens that the option reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-background-raised: ${BACKGROUND_RAISED};
        --color-background-hover: ${BACKGROUND_HOVER};
        --color-border-strong: ${BORDER_STRONG};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-foreground-muted: ${FOREGROUND_MUTED};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-default: 1px;
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --radius-sm: 8px;
        --size-icon-sm: 20px;
        --size-target-min: 44px;
        --space-4: 4px;
        --space-8: 8px;
        --space-12: 12px;
        --typography-nav-font-size: 15px;
        --typography-nav-line-height: 1.2;
        display: inline-block;
        padding: 1rem;
    }
`;

/** How an option looks in each state, as Penpot draws it. Focus keeps the look of the state. */
const LOOKS: Record<'default' | 'hover' | 'selected', ThemeOptionLook> = {
    default: { background: TRANSPARENT, borderColor: TRANSPARENT, color: FOREGROUND_MUTED },
    hover: { background: BACKGROUND_HOVER, borderColor: TRANSPARENT, color: FOREGROUND_DEFAULT },
    selected: { background: BACKGROUND_RAISED, borderColor: BORDER_STRONG, color: FOREGROUND_DEFAULT },
};

const NAMES: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };

const GLYPHS: Record<Theme, string> = { system: 'monitor', light: 'sun', dark: 'moon' };

describe('ThemeOptionComponent', () => {
    @Component({
        template: `
            <div class="tokens">
                <dma-theme-option
                    name="test-picker"
                    [theme]="theme()"
                    [checked]="checked()"
                    [display]="display()"
                    (picked)="picked.push($event)"
                />
            </div>
        `,
        styles: TOKENS,
        imports: [ThemeOptionComponent],
    })
    class TestComponent {
        public readonly theme = signal<Theme>(Theme.System);
        public readonly checked = signal(false);
        public readonly display = signal<ThemePickerDisplay>(ThemePickerDisplay.Labels);
        public readonly picked: Theme[] = [];
    }

    @Component({
        template: `<div class="tokens"><dma-theme-option name="test-picker" theme="system" /></div>`,
        styles: TOKENS,
        imports: [ThemeOptionComponent],
    })
    class DefaultTestComponent {}

    interface SetupOptions {
        theme?: Theme;
        checked?: boolean;
        display?: ThemePickerDisplay;
    }

    async function setupTest({ theme, checked, display }: SetupOptions = {}) {
        const { fixture, harness, harnessLoader } = await setupTestEnvironment({
            host: TestComponent,
            harness: ThemeOptionHarness,
        });
        const host = fixture.componentInstance;

        if (theme) {
            host.theme.set(theme);
        }
        if (checked) {
            host.checked.set(checked);
        }
        if (display) {
            host.display.set(display);
        }
        TestBed.tick();

        return { host, harness, harnessLoader };
    }

    /**
     * The label of the option, which a pointer clicks or hovers: the label draws the option over its hidden radio
     * input, so Playwright can't reach the input itself.
     */
    function option() {
        const label = document.querySelector<HTMLElement>('dma-theme-option label');

        if (!label) {
            throw new Error('The option is not on the page.');
        }
        return page.elementLocator(label);
    }

    it.each<Theme>(Object.values(Theme))('should be a radio input of %s named by its label', async (theme) => {
        const { harness } = await setupTest({ theme });

        await expect.element(page.getByRole('radio', { name: NAMES[theme], exact: true })).toBeInTheDocument();
        expect(await harness.getTheme()).toBe(theme);
        expect(await harness.getName()).toBe('test-picker');
    });

    it.each<Theme>(Object.values(Theme))(
        'should draw the icon of %s, hidden from assistive technology',
        async (theme) => {
            const { harnessLoader } = await setupTest({ theme });
            const icon = await harnessLoader.getHarness(IconHarness);

            expect(await icon.getGlyph()).toBe(GLYPHS[theme]);
            expect(await icon.isHidden()).toBe(true);
        },
    );

    it('should be checked only when the picker checks it', async () => {
        const { host, harness } = await setupTest();

        expect(await harness.isChecked()).toBe(false);

        host.checked.set(true);
        TestBed.tick();

        expect(await harness.isChecked()).toBe(true);
    });

    it('should emit its theme when the reader picks it', async () => {
        const { host } = await setupTest({ theme: Theme.Dark });

        await userEvent.click(option());

        expect(host.picked).toEqual([Theme.Dark]);
    });

    describe.each<ThemePickerDisplay>(Object.values(ThemePickerDisplay))('with display %s', (display) => {
        it('should draw the default look when it is not checked', async () => {
            const { harness } = await setupTest({ display });

            expect(await harness.getLook()).toEqual(LOOKS.default);
        });

        it('should draw the selected look when it is checked', async () => {
            const { harness } = await setupTest({ display, checked: true });

            expect(await harness.getLook()).toEqual(LOOKS.selected);
        });

        it('should draw the hover look on hover', async () => {
            const { harness } = await setupTest({ display });

            await userEvent.hover(option());
            const look = await harness.getLook();
            await userEvent.unhover(option());

            expect(look).toEqual(LOOKS.hover);
        });

        it('should draw no focus ring until it has focus', async () => {
            const { harness } = await setupTest({ display });

            expect((await harness.getFocusRing()).style).toBe('none');
        });

        it('should draw the focus ring outside itself on keyboard focus, and keep its look', async () => {
            const { harness } = await setupTest({ display, checked: true });

            await userEvent.tab();

            expect(await harness.getFocusRing()).toEqual({
                style: 'solid',
                color: FOCUS_RING,
                width: '2px',
                offset: '2px',
            });
            expect(await harness.getLook()).toEqual(LOOKS.selected);
        });

        it('should draw its icon at 20 px', async () => {
            const { harness } = await setupTest({ display });

            expect(await harness.getIconSize()).toEqual({ width: 20, height: 20 });
        });
    });

    it('should show its label at 36 px high in the labels display', async () => {
        const { harness } = await setupTest({ display: ThemePickerDisplay.Labels });

        expect(await harness.isLabelShown()).toBe(true);
        expect((await harness.getSize()).height).toBe(36);
    });

    it('should show its icon alone in a 36 px square in the icons display, and keep its name', async () => {
        const { harness } = await setupTest({ display: ThemePickerDisplay.Icons });

        expect(await harness.isLabelShown()).toBe(false);
        expect(await harness.getSize()).toEqual({ width: 36, height: 36 });
        await expect.element(page.getByRole('radio', { name: 'System', exact: true })).toBeInTheDocument();
    });

    it('should show the labels display by default', async () => {
        const { harness } = await setupTestEnvironment({ host: DefaultTestComponent, harness: ThemeOptionHarness });

        expect(await harness.isLabelShown()).toBe(true);
    });

    it('should show the labels display for a display it does not know', async () => {
        const { harness } = await setupTest({ display: 'unknown' as ThemePickerDisplay });

        expect(await harness.isLabelShown()).toBe(true);
    });
});
