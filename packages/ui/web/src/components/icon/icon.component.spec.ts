import { NgComponentOutlet } from '@angular/common';
import { Component, inject, InjectionToken, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICONS } from './icons';
import { IconHarness, setupTestEnvironment } from '../../../testing';

/** A color that no theme uses, so the icon can only take it from its parent. */
const PARENT_COLOR = 'rgb(18, 52, 86)';

/** The icon that the host component places, which each test provides before it creates the host. */
const ICON = new InjectionToken<Type<unknown>>('ICON');

describe('Icon components', () => {
    @Component({
        template: `
            <div [style.color]="parentColor">
                <ng-container [ngComponentOutlet]="icon" />
            </div>
        `,
        imports: [NgComponentOutlet],
    })
    class TestComponent {
        protected readonly icon = inject(ICON);
        protected readonly parentColor = PARENT_COLOR;
    }

    async function setupTest(icon: Type<unknown>) {
        TestBed.configureTestingModule({ providers: [{ provide: ICON, useValue: icon }] });
        const { harness } = await setupTestEnvironment(TestComponent, IconHarness);

        return { harness };
    }

    describe.each(Object.entries(ICONS))('dma-icon-%s', (glyph, icon) => {
        it('should draw its glyph', async () => {
            const { harness } = await setupTest(icon);

            expect(await harness.getGlyph()).toBe(glyph);
        });

        it('should hide itself from assistive technology', async () => {
            const { harness } = await setupTest(icon);

            expect(await harness.isHidden()).toBe(true);
        });

        it('should take its color from its parent', async () => {
            const { harness } = await setupTest(icon);

            expect(await harness.getColor()).toBe(PARENT_COLOR);
        });

        it('should draw at 24 px', async () => {
            const { harness } = await setupTest(icon);

            expect(await harness.getSize()).toEqual({ width: 24, height: 24 });
        });
    });
});
