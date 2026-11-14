import type { HarnessLoader } from '@angular/cdk/testing';
import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ButtonComponent } from './button.component';
import { ButtonKind } from './button.types';
import { IconArrowRightComponent, IconCloseComponent, IconPlusComponent } from '../icon';
import { ButtonHarness, type ButtonLook, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the button can only take each one from the token the test sets it on.
const ACCENT_DEFAULT = 'rgb(200, 30, 40)';
const ACCENT_HOVER = 'rgb(130, 20, 30)';
const FOREGROUND_ON_ACCENT = 'rgb(250, 250, 240)';
const FOREGROUND_DEFAULT = 'rgb(240, 230, 220)';
const BACKGROUND_HOVER = 'rgb(30, 40, 50)';
const BORDER_STRONG = 'rgb(220, 210, 200)';
const BORDER_CONTROL = 'rgb(120, 130, 140)';
const FOCUS_RING = 'rgb(0, 100, 250)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * Sets the semantic tokens that the button reads to values of the test, rather than loading `tokens.css`, so each
 * expectation names the token it comes from.
 */
const TOKENS = `
    .tokens {
        --color-accent-default: ${ACCENT_DEFAULT};
        --color-accent-hover: ${ACCENT_HOVER};
        --color-foreground-on-accent: ${FOREGROUND_ON_ACCENT};
        --color-foreground-default: ${FOREGROUND_DEFAULT};
        --color-background-hover: ${BACKGROUND_HOVER};
        --color-border-strong: ${BORDER_STRONG};
        --color-border-control: ${BORDER_CONTROL};
        --color-focus-ring: ${FOCUS_RING};
        --border-width-default: 1px;
        --border-width-focus: 2px;
        --focus-offset: 2px;
        --radius-md: 10px;
        --size-target-min: 44px;
        --space-8: 8px;
        --space-20: 20px;
        --typography-button-font-size: 16px;
        --typography-button-font-weight: 600;
        --typography-button-line-height: 1.2;
        --typography-button-text-decoration: none;
        display: inline-block;
        padding: 1rem;
    }
`;

/**
 * The width of `.container` in the width tests, narrower than any screen. Angular reads `styles` while it compiles, so
 * they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 320;

/** How each kind looks by default and on hover, as Penpot draws it. Focus keeps the default look. */
const LOOKS: Record<ButtonKind, { default: ButtonLook; hover: ButtonLook }> = {
    primary: {
        default: { background: ACCENT_DEFAULT, borderColor: TRANSPARENT, color: FOREGROUND_ON_ACCENT },
        hover: { background: ACCENT_HOVER, borderColor: TRANSPARENT, color: FOREGROUND_ON_ACCENT },
    },
    secondary: {
        default: { background: TRANSPARENT, borderColor: BORDER_STRONG, color: FOREGROUND_DEFAULT },
        hover: { background: BACKGROUND_HOVER, borderColor: BORDER_STRONG, color: FOREGROUND_DEFAULT },
    },
    quiet: {
        default: { background: TRANSPARENT, borderColor: BORDER_CONTROL, color: FOREGROUND_DEFAULT },
        hover: { background: BACKGROUND_HOVER, borderColor: BORDER_CONTROL, color: FOREGROUND_DEFAULT },
    },
};

describe('ButtonComponent', () => {
    @Component({
        template: `<div class="tokens"><button dma-button type="button" [kind]="kind()">Save</button></div>`,
        styles: TOKENS,
        imports: [ButtonComponent],
    })
    class ButtonHostComponent {
        public readonly kind = signal<ButtonKind>(ButtonKind.Primary);
    }

    @Component({
        template: `<div class="tokens"><a dma-button href="#save" [kind]="kind()">Save</a></div>`,
        styles: TOKENS,
        imports: [ButtonComponent],
    })
    class LinkHostComponent {
        public readonly kind = signal<ButtonKind>(ButtonKind.Primary);
    }

    @Component({
        template: `<div class="tokens"><button dma-button type="button">Save</button></div>`,
        styles: TOKENS,
        imports: [ButtonComponent],
    })
    class DefaultHostComponent {}

    @Component({
        template: `
            <div class="tokens leading">
                <button dma-button type="button" [kind]="kind()"><dma-icon-plus />Save</button>
            </div>
            <div class="tokens trailing">
                <button dma-button type="button" [kind]="kind()">Save<dma-icon-arrow-right /></button>
            </div>
            <div class="tokens icon-only">
                <button dma-button type="button" [kind]="kind()" aria-label="Close"><dma-icon-close /></button>
            </div>
            <div class="tokens label-only"><button dma-button type="button" [kind]="kind()">Save</button></div>
        `,
        styles: TOKENS,
        imports: [ButtonComponent, IconArrowRightComponent, IconCloseComponent, IconPlusComponent],
    })
    class IconHostComponent {
        public readonly kind = signal<ButtonKind>(ButtonKind.Primary);
    }

    @Component({
        template: `
            <div class="tokens container in-block"><button dma-button type="button">Save</button></div>
            <div class="tokens container link-in-block"><a dma-button href="#save">Save</a></div>
            <div class="tokens container row in-row"><button dma-button type="button">Save</button></div>
        `,
        styles: [
            TOKENS,
            `
                .container {
                    display: block;
                    width: 320px;
                    padding: 0;
                }

                .row {
                    display: flex;
                }
            `,
        ],
        imports: [ButtonComponent],
    })
    class WidthHostComponent {}

    /** Loads the harness of the button in the element that `selector` finds. */
    async function getButton(harnessLoader: HarnessLoader, selector: string) {
        return await (await harnessLoader.getChildLoader(selector)).getHarness(ButtonHarness);
    }

    /** Each element the button goes on, with the role it keeps. */
    const HOSTS = [
        { element: 'button', role: 'button', host: ButtonHostComponent },
        { element: 'a', role: 'link', host: LinkHostComponent },
    ] as const;

    async function setupTest(host: Type<unknown>, kind?: ButtonKind) {
        const { fixture, harness } = await setupTestEnvironment({ host, harness: ButtonHarness });

        if (kind) {
            (fixture.componentInstance as ButtonHostComponent).kind.set(kind);
        }
        TestBed.tick();

        return { harness };
    }

    describe.each(HOSTS)('on <$element>', ({ role, host }) => {
        describe.each<ButtonKind>(Object.values(ButtonKind))('of kind %s', (kind) => {
            it(`should keep the ${role} role and be named by its label`, async () => {
                const { harness } = await setupTest(host, kind);

                await expect.element(page.getByRole(role, { name: 'Save', exact: true })).toBeInTheDocument();
                expect(await harness.getText()).toBe('Save');
            });

            it('should draw its default look', async () => {
                const { harness } = await setupTest(host, kind);

                expect(await harness.getLook()).toEqual(LOOKS[kind].default);
            });

            it('should draw its hover look', async () => {
                const { harness } = await setupTest(host, kind);
                const element = page.getByRole(role, { name: 'Save' });

                await userEvent.hover(element);
                const look = await harness.getLook();
                await userEvent.unhover(element);

                expect(look).toEqual(LOOKS[kind].hover);
            });

            it('should meet the 44 px target size', async () => {
                const { harness } = await setupTest(host, kind);

                expect((await harness.getSize()).height).toBe(44);
            });

            it('should draw no focus ring until it has focus', async () => {
                const { harness } = await setupTest(host, kind);

                expect((await harness.getFocusRing()).style).toBe('none');
            });

            it('should draw the focus ring outside itself on keyboard focus', async () => {
                const { harness } = await setupTest(host, kind);

                await userEvent.tab();

                await expect.element(page.getByRole(role, { name: 'Save' })).toHaveFocus();
                expect(await harness.getFocusRing()).toEqual({
                    style: 'solid',
                    color: FOCUS_RING,
                    width: '2px',
                    offset: '2px',
                });
            });

            it('should keep its default look on keyboard focus', async () => {
                const { harness } = await setupTest(host, kind);

                await userEvent.tab();

                expect(await harness.getLook()).toEqual(LOOKS[kind].default);
            });
        });
    });

    it('should draw the primary kind by default', async () => {
        const { harness } = await setupTest(DefaultHostComponent);

        expect(await harness.getLook()).toEqual(LOOKS.primary.default);
    });

    it('should draw the primary kind for a kind it does not know', async () => {
        const { harness } = await setupTest(ButtonHostComponent, 'unknown' as ButtonKind);

        expect(await harness.getLook()).toEqual(LOOKS.primary.default);
    });

    describe('with icons', () => {
        async function setupIconTest(kind: ButtonKind = ButtonKind.Primary) {
            const { fixture, harnessLoader } = await setupTestEnvironment({
                host: IconHostComponent,
                harness: ButtonHarness,
            });

            fixture.componentInstance.kind.set(kind);
            TestBed.tick();

            return {
                leading: await getButton(harnessLoader, '.leading'),
                trailing: await getButton(harnessLoader, '.trailing'),
                iconOnly: await getButton(harnessLoader, '.icon-only'),
                labelOnly: await getButton(harnessLoader, '.label-only'),
            };
        }

        it('should draw an icon before its label at the start of the button', async () => {
            const { leading } = await setupIconTest();

            expect(await leading.getIconInsets()).toEqual([expect.objectContaining({ top: 10, bottom: 10, left: 20 })]);
        });

        it('should draw an icon after its label at the end of the button', async () => {
            const { trailing } = await setupIconTest();

            expect(await trailing.getIconInsets()).toEqual([
                expect.objectContaining({ top: 10, bottom: 10, right: 20 }),
            ]);
        });

        it('should leave 8 px between an icon and its label', async () => {
            const { leading, trailing, labelOnly } = await setupIconTest();
            const { width } = await labelOnly.getSize();

            expect((await leading.getSize()).width).toBeCloseTo(width + 24 + 8);
            expect((await trailing.getSize()).width).toBeCloseTo(width + 24 + 8);
        });

        it('should keep the padding of a label around an icon of its own', async () => {
            const { iconOnly } = await setupIconTest();

            expect(await iconOnly.getIconInsets()).toEqual([{ top: 10, right: 20, bottom: 10, left: 20 }]);
            expect(await iconOnly.getSize()).toEqual({ width: 64, height: 44 });
        });

        it('should be named by its aria-label with an icon of its own', async () => {
            const { iconOnly } = await setupIconTest();
            const icons = await iconOnly.getIcons();

            await expect.element(page.getByRole('button', { name: 'Close', exact: true })).toBeInTheDocument();
            expect(await Promise.all(icons.map(async (icon) => await icon.isHidden()))).toEqual([true]);
        });

        it.each<ButtonKind>(Object.values(ButtonKind))(
            'should draw its icons 24 px in the color of its label of kind %s',
            async (kind) => {
                const { leading, trailing, iconOnly } = await setupIconTest(kind);
                const icons = (
                    await Promise.all([leading.getIcons(), trailing.getIcons(), iconOnly.getIcons()])
                ).flat();

                for (const icon of icons) {
                    expect(await icon.getSize()).toEqual({ width: 24, height: 24 });
                    expect(await icon.getColor()).toBe(LOOKS[kind].default.color);
                }
            },
        );
    });

    describe('width', () => {
        async function setupWidthTest() {
            const { harnessLoader } = await setupTestEnvironment({ host: WidthHostComponent, harness: ButtonHarness });

            return {
                inBlock: await getButton(harnessLoader, '.in-block'),
                linkInBlock: await getButton(harnessLoader, '.link-in-block'),
                inRow: await getButton(harnessLoader, '.in-row'),
            };
        }

        describe('on narrow screens', () => {
            it('should fill a block container', async () => {
                const { inBlock, linkInBlock } = await setupWidthTest();

                expect((await inBlock.getSize()).width).toBe(CONTAINER_WIDTH);
                expect((await linkInBlock.getSize()).width).toBe(CONTAINER_WIDTH);
            });

            it('should keep the width of its content in a flex row', async () => {
                const { inRow } = await setupWidthTest();

                expect((await inRow.getSize()).width).toBeLessThan(CONTAINER_WIDTH);
            });
        });

        describe('on wide screens', () => {
            const { innerWidth, innerHeight } = window;

            beforeEach(async () => {
                await page.viewport(1280, 800);
            });

            afterEach(async () => {
                await page.viewport(innerWidth, innerHeight);
            });

            it('should keep the width of its content in every container', async () => {
                const { inBlock, linkInBlock, inRow } = await setupWidthTest();
                const { width } = await inRow.getSize();

                expect(width).toBeLessThan(CONTAINER_WIDTH);
                expect((await inBlock.getSize()).width).toBe(width);
                expect((await linkInBlock.getSize()).width).toBe(width);
            });
        });
    });
});
