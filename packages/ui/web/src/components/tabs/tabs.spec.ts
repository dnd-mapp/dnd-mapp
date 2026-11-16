import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';
import { readColorToken, setupTestEnvironment, TabListHarness, type TabLook } from '@dnd-mapp/ui-web/testing';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/** The labels of the tabs, in order. */
const LABELS = ['Overview', 'Stats', 'Spells'];

/**
 * The width of `.container`, so the width tests can tell filling it from fitting the tabs. Angular reads `styles` while
 * it compiles, so they repeat the value rather than interpolate it.
 */
const CONTAINER_WIDTH = 480;

/** How a tab looks in each state, as Penpot draws it, in the colors of the theme the test runs in. */
function readLooks(): Record<'default' | 'selected', TabLook> {
    return {
        default: { background: TRANSPARENT, color: readColorToken('--color-foreground-muted'), fontWeight: '600' },
        selected: { background: TRANSPARENT, color: readColorToken('--color-foreground-default'), fontWeight: '600' },
    };
}

describe('Tabs', () => {
    @Component({
        template: `
            <div class="container">
                <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
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
    class TestComponent {
        public readonly selected = signal(0);
    }

    async function setupTest(selected?: number) {
        const { fixture, harness } = await setupTestEnvironment({ host: TestComponent, harness: TabListHarness });

        if (selected !== undefined) {
            fixture.componentInstance.selected.set(selected);
            TestBed.tick();
        }
        return { fixture, harness };
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

        it('should mark the selected tab for assistive technology', async () => {
            await setupTest();

            await expect.element(page.getByRole('tab', { name: 'Overview', selected: true })).toBeInTheDocument();
            expect(page.getByRole('tab', { selected: true }).all()).toHaveLength(1);
        });
    });

    describe('selection', () => {
        it('should select the first tab by default', async () => {
            const { harness } = await setupTest();

            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        it('should mark the selected tab alone, and keep only it in the tab order', async () => {
            const { harness } = await setupTest(1);
            const tabs = await harness.getTabs();

            expect(await Promise.all(tabs.map(async (tab) => await tab.isSelected()))).toEqual([false, true, false]);
            expect(await Promise.all(tabs.map(async (tab) => await tab.getTabIndex()))).toEqual(['-1', '0', '-1']);
        });

        it('should start on the tab at the bound index', async () => {
            const { harness } = await setupTest(2);

            expect(await harness.getSelectedLabel()).toBe('Spells');
        });

        it('should select the first tab for an index without a tab', async () => {
            const { harness } = await setupTest(5);

            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        it('should select a tab on a click', async () => {
            const { harness } = await setupTest();

            await (await harness.getTab('Stats')).click();

            expect(await harness.getSelectedLabel()).toBe('Stats');
        });

        it('should report the clicked tab through the bound index', async () => {
            const { fixture, harness } = await setupTest();

            await (await harness.getTab('Spells')).click();

            expect(fixture.componentInstance.selected()).toBe(2);
        });
    });

    describe('tab', () => {
        it('should draw its default look', async () => {
            const { harness } = await setupTest();

            expect(await (await harness.getTab('Stats')).getLook()).toEqual(readLooks().default);
        });

        it('should draw no indicator by default', async () => {
            const { harness } = await setupTest();

            expect(await (await harness.getTab('Stats')).getIndicator()).toBeNull();
        });

        it('should draw its selected look, with the indicator along its bottom edge', async () => {
            const { harness } = await setupTest();
            const tab = await harness.getTab('Overview');
            const { width } = await tab.getSize();

            expect(await tab.getLook()).toEqual(readLooks().selected);
            expect(await tab.getIndicator()).toEqual({
                color: readColorToken('--color-accent-text'),
                left: 0,
                top: 42,
                width,
                height: 2,
            });
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
