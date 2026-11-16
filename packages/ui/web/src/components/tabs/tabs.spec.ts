import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';
import { readColorToken, setupTestEnvironment, TabListHarness } from '@dnd-mapp/ui-web/testing';

/** The labels of the tabs, in order. */
const LABELS = ['Overview', 'Stats', 'Spells'];

/**
 * The width of `.container`, so the width tests can tell filling it from fitting the tabs. Angular reads `styles` while
 * it compiles, so they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 480;

describe('Tabs', () => {
    @Component({
        template: `
            <div class="container">
                <dma-tab-list aria-label="Character sheet">
                    <button dma-tab>Overview</button>
                    <button dma-tab>Stats</button>
                    <button dma-tab>Spells</button>
                </dma-tab-list>
            </div>
        `,
        styles: `
            .container {
                width: 480px;
            }
        `,
        imports: [TabComponent, TabListComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: TabListHarness });

        return { harness };
    }

    describe('roles', () => {
        it('should be a tab list named by its label, with a tab for each button', async () => {
            const { harness } = await setupTest();

            await expect.element(page.getByRole('tablist', { name: 'Character sheet' })).toBeInTheDocument();
            for (const label of LABELS) {
                await expect.element(page.getByRole('tab', { name: label, exact: true })).toBeInTheDocument();
            }
            expect(await harness.getLabels()).toEqual(LABELS);
        });

        it('should keep the tabs from submitting a form', async () => {
            await setupTest();

            await expect.element(page.getByRole('tab', { name: 'Stats' })).toHaveAttribute('type', 'button');
        });
    });

    describe('tab', () => {
        it('should draw its default look', async () => {
            const { harness } = await setupTest();

            for (const tab of await harness.getTabs()) {
                expect(await tab.getLook()).toEqual({
                    background: 'rgba(0, 0, 0, 0)',
                    color: readColorToken('--color-foreground-muted'),
                    fontWeight: '600',
                });
            }
        });

        it('should be as tall as the minimum target size, with padding at each side and rounded corners', async () => {
            const { harness } = await setupTest();

            for (const tab of await harness.getTabs()) {
                expect(await tab.getBox()).toEqual({
                    height: 44,
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: '8px',
                });
            }
        });
    });

    describe('tab list', () => {
        it('should fill its container at the height of a tab', async () => {
            const { harness } = await setupTest();

            expect(await harness.getSize()).toEqual({ width: CONTAINER_WIDTH, height: 44 });
        });

        it('should set its tabs apart by the gap, each as wide as its label', async () => {
            const { harness } = await setupTest();
            const tabs = await harness.getTabs();
            const widths = await Promise.all(tabs.map(async (tab) => (await tab.getSize()).width));

            expect(await harness.getGap()).toBe('4px');
            expect(widths.reduce((sum, width) => sum + width, 0) + 2 * 4).toBeLessThan(CONTAINER_WIDTH);
        });

        it('should draw the divider along its bottom edge', async () => {
            const { harness } = await setupTest();

            expect(await harness.getDivider()).toEqual({ color: readColorToken('--color-border-divider'), width: 1 });
        });
    });
});
