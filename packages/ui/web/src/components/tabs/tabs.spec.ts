import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';
import { TabPanelComponent } from './tab-panel.component';
import {
    readColorToken,
    setupTestEnvironment,
    TabListHarness,
    type TabLook,
    TabPanelHarness,
} from '@dnd-mapp/ui-web/testing';

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
                    <button dma-tab [panel]="overview">Overview</button>
                    <button dma-tab [panel]="stats">Stats</button>
                    <button dma-tab [panel]="spells">Spells</button>
                </dma-tab-list>
                <dma-tab-panel #overview>The overview of the character.</dma-tab-panel>
                <dma-tab-panel #stats>The ability scores of the character.</dma-tab-panel>
                <dma-tab-panel #spells>The spells the character knows.</dma-tab-panel>
                <dma-tab-panel>A panel that no tab names.</dma-tab-panel>
            </div>
        `,
        styles: `
            .container {
                width: 480px;
            }
        `,
        imports: [TabComponent, TabListComponent, TabPanelComponent],
    })
    class TestComponent {
        public readonly selected = signal(0);
    }

    /** Tabs too wide for their container, so the tab list scrolls. */
    @Component({
        template: `
            <div class="container">
                <dma-tab-list aria-label="Character sheet">
                    <button dma-tab [panel]="overview">Overview</button>
                    <button dma-tab [panel]="stats">Stats</button>
                    <button dma-tab [panel]="spells">Spells</button>
                </dma-tab-list>
                <dma-tab-panel #overview>The overview of the character.</dma-tab-panel>
                <dma-tab-panel #stats>The ability scores of the character.</dma-tab-panel>
                <dma-tab-panel #spells>The spells the character knows.</dma-tab-panel>
            </div>
        `,
        styles: `
            .container {
                width: 160px;
            }
        `,
        imports: [TabComponent, TabListComponent, TabPanelComponent],
    })
    class OverflowTestComponent {}

    async function setupTest(selected?: number) {
        const { fixture, harness, harnessLoader } = await setupTestEnvironment({
            host: TestComponent,
            harness: TabListHarness,
        });

        if (selected !== undefined) {
            fixture.componentInstance.selected.set(selected);
            TestBed.tick();
        }
        const panels = await harnessLoader.getAllHarnesses(TabPanelHarness);

        return { fixture, harness, panels };
    }

    /** The texts of the panels that show. */
    async function readShownPanels(panels: TabPanelHarness[]) {
        const shown = await Promise.all(panels.map(async (panel) => ((await panel.isShown()) ? panel : null)));

        return await Promise.all(shown.filter((panel) => panel !== null).map(async (panel) => await panel.getText()));
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

        it('should show one tab panel, named by its tab', async () => {
            await setupTest();

            await expect
                .element(page.getByRole('tabpanel', { name: 'Overview' }))
                .toHaveTextContent('The overview of the character.');
            expect(page.getByRole('tabpanel').all()).toHaveLength(1);
        });
    });

    describe('links between tabs and panels', () => {
        it('should point each tab at its panel, and each panel back at its tab', async () => {
            const { harness, panels } = await setupTest();
            const tabs = await harness.getTabs();

            for (const [index, tab] of tabs.entries()) {
                const panel = panels[index];

                expect(await tab.getControls()).toBe(await panel?.getId());
                expect(await panel?.getLabelledBy()).toBe(await tab.getId());
            }
        });

        it('should give every tab and panel an id of its own', async () => {
            const { harness, panels } = await setupTest();
            const tabs = await harness.getTabs();
            const ids = await Promise.all([...tabs, ...panels].map(async (part) => await part.getId()));

            expect(ids.every((id) => id)).toBe(true);
            expect(new Set(ids).size).toBe(ids.length);
        });

        it('should hide a panel that no tab names, and leave it unlabeled', async () => {
            const { panels } = await setupTest();
            const unnamed = panels[3];

            expect(await unnamed?.isShown()).toBe(false);
            expect(await unnamed?.getLabelledBy()).toBeNull();
        });

        it('should put the panel in the tab order', async () => {
            const { panels } = await setupTest();

            expect(await panels[0]?.getTabIndex()).toBe('0');
        });
    });

    describe('selection', () => {
        it('should select the first tab and show its panel by default', async () => {
            const { harness, panels } = await setupTest();

            expect(await harness.getSelectedLabel()).toBe('Overview');
            expect(await readShownPanels(panels)).toEqual(['The overview of the character.']);
        });

        it('should mark the selected tab alone, and keep only it in the tab order', async () => {
            const { harness } = await setupTest(1);
            const tabs = await harness.getTabs();

            expect(await Promise.all(tabs.map(async (tab) => await tab.isSelected()))).toEqual([false, true, false]);
            expect(await Promise.all(tabs.map(async (tab) => await tab.getTabIndex()))).toEqual(['-1', '0', '-1']);
        });

        it('should start on the tab at the bound index', async () => {
            const { harness, panels } = await setupTest(2);

            expect(await harness.getSelectedLabel()).toBe('Spells');
            expect(await readShownPanels(panels)).toEqual(['The spells the character knows.']);
        });

        it('should select the first tab for an index without a tab', async () => {
            const { harness } = await setupTest(5);

            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        it('should select a tab and show its panel on a click', async () => {
            const { harness, panels } = await setupTest();

            await (await harness.getTab('Stats')).click();

            expect(await harness.getSelectedLabel()).toBe('Stats');
            expect(await readShownPanels(panels)).toEqual(['The ability scores of the character.']);
        });

        it('should report the clicked tab through the bound index', async () => {
            const { fixture, harness } = await setupTest();

            await (await harness.getTab('Spells')).click();

            expect(fixture.componentInstance.selected()).toBe(2);
        });
    });

    describe('keyboard', () => {
        /** Focuses the tab labeled `label`, then presses `keys` as `userEvent.keyboard` spells them. */
        async function press(harness: TabListHarness, label: string, keys: string) {
            await (await harness.getTab(label)).focus();
            await userEvent.keyboard(keys);
        }

        it('should reach the selected tab with Tab', async () => {
            const { harness } = await setupTest(1);

            await userEvent.tab();

            expect(await harness.getFocusedLabel()).toBe('Stats');
        });

        it('should move to the next tab with the right arrow, and select it', async () => {
            const { harness, panels } = await setupTest();

            await press(harness, 'Overview', '{ArrowRight}');

            expect(await harness.getFocusedLabel()).toBe('Stats');
            expect(await harness.getSelectedLabel()).toBe('Stats');
            expect(await readShownPanels(panels)).toEqual(['The ability scores of the character.']);
        });

        it('should move to the previous tab with the left arrow, and select it', async () => {
            const { harness } = await setupTest(2);

            await press(harness, 'Spells', '{ArrowLeft}');

            expect(await harness.getFocusedLabel()).toBe('Stats');
            expect(await harness.getSelectedLabel()).toBe('Stats');
        });

        it('should wrap from the last tab to the first with the right arrow', async () => {
            const { harness } = await setupTest(2);

            await press(harness, 'Spells', '{ArrowRight}');

            expect(await harness.getFocusedLabel()).toBe('Overview');
            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        it('should wrap from the first tab to the last with the left arrow', async () => {
            const { harness } = await setupTest();

            await press(harness, 'Overview', '{ArrowLeft}');

            expect(await harness.getFocusedLabel()).toBe('Spells');
            expect(await harness.getSelectedLabel()).toBe('Spells');
        });

        it('should jump to the last tab with End, and to the first with Home', async () => {
            const { harness } = await setupTest(1);

            await press(harness, 'Stats', '{End}');

            expect(await harness.getFocusedLabel()).toBe('Spells');
            expect(await harness.getSelectedLabel()).toBe('Spells');

            await userEvent.keyboard('{Home}');

            expect(await harness.getFocusedLabel()).toBe('Overview');
            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        it('should report the tab a key selects through the bound index', async () => {
            const { fixture, harness } = await setupTest();

            await press(harness, 'Overview', '{End}');

            expect(fixture.componentInstance.selected()).toBe(2);
        });

        it('should leave an arrow key with Ctrl to the browser', async () => {
            const { harness } = await setupTest();

            await press(harness, 'Overview', '{Control>}{ArrowRight}{/Control}');

            expect(await harness.getFocusedLabel()).toBe('Overview');
            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        it('should move from the selected tab into its panel with Tab', async () => {
            const { harness, panels } = await setupTest();

            await press(harness, 'Overview', '{ArrowRight}');
            await userEvent.tab();

            expect(await panels[1]?.isFocused()).toBe(true);
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

        it('should scroll sideways at the height of a tab when its tabs do not fit', async () => {
            const { harness } = await setupTestEnvironment({ host: OverflowTestComponent, harness: TabListHarness });

            expect(await harness.isScrollable()).toBe(true);
            expect(await harness.getSize()).toEqual({ width: 160, height: 44 });
        });

        it('should scroll a tab the keys reach into view', async () => {
            const { harness } = await setupTestEnvironment({ host: OverflowTestComponent, harness: TabListHarness });

            expect(await harness.isTabInView('Spells')).toBe(false);

            await (await harness.getTab('Overview')).focus();
            await userEvent.keyboard('{End}');

            expect(await harness.isTabInView('Spells')).toBe(true);

            await userEvent.keyboard('{Home}');

            expect(await harness.isTabInView('Overview')).toBe(true);
        });
    });
});
