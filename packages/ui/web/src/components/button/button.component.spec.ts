import type { HarnessLoader } from '@angular/cdk/testing';
import { Component, signal, type Type, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ButtonComponent } from './button.component';
import { ButtonKind } from './button.types';
import { IconArrowRightComponent, IconCloseComponent, IconPlusComponent } from '../icon';
import { ButtonHarness, type ButtonLook, readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** Leaves room around the button for its focus ring. */
const FRAME = `
    .frame {
        display: inline-block;
        padding: 1rem;
    }
`;

/**
 * The width of `.container` in the width tests, narrower than any screen. Angular reads `styles` while it compiles, so
 * they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 320;

/**
 * How each kind looks by default and on hover, as Penpot draws it, in the colors of the theme the test runs in. Focus
 * keeps the default look.
 */
function readLooks(): Record<ButtonKind, { default: ButtonLook; hover: ButtonLook }> {
    const accentDefault = readColorToken('--color-accent-default');
    const accentHover = readColorToken('--color-accent-hover');
    const foregroundOnAccent = readColorToken('--color-foreground-on-accent');
    const foregroundDefault = readColorToken('--color-foreground-default');
    const backgroundHover = readColorToken('--color-background-hover');
    const borderStrong = readColorToken('--color-border-strong');
    const borderControl = readColorToken('--color-border-control');

    return {
        primary: {
            default: { background: accentDefault, borderColor: TRANSPARENT, color: foregroundOnAccent },
            hover: { background: accentHover, borderColor: TRANSPARENT, color: foregroundOnAccent },
        },
        secondary: {
            default: { background: TRANSPARENT, borderColor: borderStrong, color: foregroundDefault },
            hover: { background: backgroundHover, borderColor: borderStrong, color: foregroundDefault },
        },
        quiet: {
            default: { background: TRANSPARENT, borderColor: borderControl, color: foregroundDefault },
            hover: { background: backgroundHover, borderColor: borderControl, color: foregroundDefault },
        },
    };
}

describe('ButtonComponent', () => {
    /** A host whose button takes its kind from a signal, so `setupTest` can set it. */
    interface KindHost {
        readonly kind: WritableSignal<ButtonKind>;
    }

    @Component({
        template: `<div class="frame"><button dma-button type="button" [kind]="kind()">Save</button></div>`,
        styles: FRAME,
        imports: [ButtonComponent],
    })
    class ButtonHostComponent implements KindHost {
        public readonly kind = signal<ButtonKind>(ButtonKind.Primary);
    }

    @Component({
        template: `<div class="frame"><a dma-button href="#save" [kind]="kind()">Save</a></div>`,
        styles: FRAME,
        imports: [ButtonComponent],
    })
    class LinkHostComponent implements KindHost {
        public readonly kind = signal<ButtonKind>(ButtonKind.Primary);
    }

    @Component({
        template: `<div class="frame"><button dma-button type="button">Save</button></div>`,
        styles: FRAME,
        imports: [ButtonComponent],
    })
    class DefaultHostComponent {}

    @Component({
        template: `
            <div class="frame leading">
                <button dma-button type="button" [kind]="kind()"><dma-icon-plus />Save</button>
            </div>
            <div class="frame trailing">
                <button dma-button type="button" [kind]="kind()">Save<dma-icon-arrow-right /></button>
            </div>
            <div class="frame icon-only">
                <button dma-button type="button" [kind]="kind()" aria-label="Close"><dma-icon-close /></button>
            </div>
            <div class="frame label-only"><button dma-button type="button" [kind]="kind()">Save</button></div>
        `,
        styles: FRAME,
        imports: [ButtonComponent, IconArrowRightComponent, IconCloseComponent, IconPlusComponent],
    })
    class IconHostComponent {
        public readonly kind = signal<ButtonKind>(ButtonKind.Primary);
    }

    @Component({
        template: `
            <div class="container in-block"><button dma-button type="button">Save</button></div>
            <div class="container link-in-block"><a dma-button href="#save">Save</a></div>
            <div class="container row in-row"><button dma-button type="button">Save</button></div>
        `,
        styles: `
            .container {
                width: 320px;
            }

            .row {
                display: flex;
            }
        `,
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

    async function setupTest(host: Type<KindHost>, kind: ButtonKind) {
        const { fixture, harness } = await setupTestEnvironment({ host, harness: ButtonHarness });

        fixture.componentInstance.kind.set(kind);
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

                expect(await harness.getLook()).toEqual(readLooks()[kind].default);
            });

            it('should draw its hover look', async () => {
                const { harness } = await setupTest(host, kind);
                const element = page.getByRole(role, { name: 'Save' });

                await userEvent.hover(element);
                const look = await harness.getLook();
                await userEvent.unhover(element);

                expect(look).toEqual(readLooks()[kind].hover);
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
                    color: readColorToken('--color-focus-ring'),
                    width: '2px',
                    offset: '2px',
                });
            });

            it('should keep its default look on keyboard focus', async () => {
                const { harness } = await setupTest(host, kind);

                await userEvent.tab();

                expect(await harness.getLook()).toEqual(readLooks()[kind].default);
            });
        });
    });

    it('should draw the primary kind by default', async () => {
        const { harness } = await setupTestEnvironment({ host: DefaultHostComponent, harness: ButtonHarness });

        expect(await harness.getLook()).toEqual(readLooks().primary.default);
    });

    it('should draw the primary kind for a kind it does not know', async () => {
        const { harness } = await setupTest(ButtonHostComponent, 'unknown' as ButtonKind);

        expect(await harness.getLook()).toEqual(readLooks().primary.default);
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
                    expect(await icon.getColor()).toBe(readLooks()[kind].default.color);
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
