import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { ButtonComponent } from './button.component';
import { ButtonKind } from './button.types';
import { ButtonHarness, type ButtonLook, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

// Colors that no theme uses, so the button can only take each one from the token the test sets it on.
const ACCENT_DEFAULT = 'rgb(200, 30, 40)';
const ACCENT_HOVER = 'rgb(130, 20, 30)';
const FOREGROUND_ON_ACCENT = 'rgb(250, 250, 240)';
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

/** How each kind looks by default and on hover, as Penpot draws it. Focus keeps the default look. */
const LOOKS: Record<ButtonKind, { default: ButtonLook; hover: ButtonLook }> = {
    primary: {
        default: { background: ACCENT_DEFAULT, borderColor: TRANSPARENT, color: FOREGROUND_ON_ACCENT },
        hover: { background: ACCENT_HOVER, borderColor: TRANSPARENT, color: FOREGROUND_ON_ACCENT },
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
});
