import { ApplicationRef, Component, inject, InjectionToken, signal, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { cdp, page, userEvent } from 'vitest/browser';
import { TabComponent } from './tab.component';
import { TabListComponent } from './tab-list.component';
import { TabPanelComponent } from './tab-panel.component';
import {
    readColorToken,
    setupTestEnvironment,
    type TabListEdge,
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

/** The labels of the tabs of the host whose tabs scroll, in order. */
const SCROLL_LABELS = ['Overview', 'Stats', 'Spells', 'Inventory', 'Features', 'Notes'];

/** The index of the tab the host whose tabs scroll starts on. */
const START = new InjectionToken<number>('START', { factory: () => 0 });

/** How a test changes the selection: from outside the list, with a click, or with a key. */
type SelectionSource = 'outside' | 'click' | 'key';

/**
 * The fade at an end with a scroll button, as Penpot draws it: the tabs hide under the room of the focus ring and the
 * 44 px button, and show whole again 16 px past it.
 */
const FADE = { hide: 4 + 44, show: 4 + 44 + 16 };

/**
 * How a tab looks in each state, as Penpot draws it, in the colors of the theme the test runs in. Focus keeps the look of
 * the state it adds to.
 */
function readLooks(): Record<'default' | 'hover' | 'selected', TabLook> {
    const foregroundDefault = readColorToken('--color-foreground-default');

    return {
        default: { background: TRANSPARENT, color: readColorToken('--color-foreground-muted'), fontWeight: '600' },
        hover: { background: readColorToken('--color-background-hover'), color: foregroundDefault, fontWeight: '600' },
        selected: { background: TRANSPARENT, color: foregroundDefault, fontWeight: '600' },
    };
}

/** The focus ring of a tab and a panel, as Penpot draws it on a tab: 2 px wide, 2 px outside the box. */
function readFocusRing() {
    return { style: 'solid', color: readColorToken('--color-focus-ring'), width: '2px', offset: '2px' };
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

    /**
     * Six tabs too wide for their container, which still leaves room between its ends for a tab to show whole. The
     * container is `width` pixels wide, so a test can resize it, and the list starts on the tab at `START`.
     */
    @Component({
        template: `
            <div [style.width.px]="width()">
                <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
                    <button dma-tab [panel]="overview">Overview</button>
                    <button dma-tab [panel]="stats">Stats</button>
                    <button dma-tab [panel]="spells">Spells</button>
                    <button dma-tab [panel]="inventory">Inventory</button>
                    <button dma-tab [panel]="features">Features</button>
                    <button dma-tab [panel]="notes">Notes</button>
                </dma-tab-list>
                <dma-tab-panel #overview>The overview of the character.</dma-tab-panel>
                <dma-tab-panel #stats>The ability scores of the character.</dma-tab-panel>
                <dma-tab-panel #spells>The spells the character knows.</dma-tab-panel>
                <dma-tab-panel #inventory>What the character carries.</dma-tab-panel>
                <dma-tab-panel #features>The class features of the character.</dma-tab-panel>
                <dma-tab-panel #notes>Whatever the player wants to remember.</dma-tab-panel>
            </div>
        `,
        imports: [TabComponent, TabListComponent, TabPanelComponent],
    })
    class ScrollTestComponent {
        public readonly width = signal(320);
        public readonly selected = signal(inject(START));
    }

    /**
     * The six tabs of `ScrollTestComponent`, below the fold of a page that scrolls, after a button that can hold the
     * focus, so a test can tell whether the tab list scrolls the page or moves the focus.
     */
    @Component({
        template: `
            <div class="page">
                <button type="button">Elsewhere</button>
                <div class="fold"></div>
                <div class="container">
                    <dma-tab-list aria-label="Character sheet" [(selected)]="selected">
                        <button dma-tab [panel]="overview">Overview</button>
                        <button dma-tab [panel]="stats">Stats</button>
                        <button dma-tab [panel]="spells">Spells</button>
                        <button dma-tab [panel]="inventory">Inventory</button>
                        <button dma-tab [panel]="features">Features</button>
                        <button dma-tab [panel]="notes">Notes</button>
                    </dma-tab-list>
                </div>
                <dma-tab-panel #overview>The overview of the character.</dma-tab-panel>
                <dma-tab-panel #stats>The ability scores of the character.</dma-tab-panel>
                <dma-tab-panel #spells>The spells the character knows.</dma-tab-panel>
                <dma-tab-panel #inventory>What the character carries.</dma-tab-panel>
                <dma-tab-panel #features>The class features of the character.</dma-tab-panel>
                <dma-tab-panel #notes>Whatever the player wants to remember.</dma-tab-panel>
            </div>
        `,
        styles: `
            .page {
                height: 200px;
                overflow: auto;
            }

            .fold {
                height: 400px;
            }

            .container {
                width: 320px;
            }
        `,
        imports: [TabComponent, TabListComponent, TabPanelComponent],
    })
    class PageTestComponent {
        public readonly selected = signal(0);
    }

    /**
     * Three tabs that fit their container, and three more that join them while `more` is true, which no longer fit. The
     * first tab shows `firstLabel`, so a test can widen it.
     */
    @Component({
        template: `
            <div class="container">
                <dma-tab-list aria-label="Character sheet">
                    <button dma-tab [panel]="overview">{{ firstLabel() }}</button>
                    <button dma-tab [panel]="stats">Stats</button>
                    <button dma-tab [panel]="spells">Spells</button>
                    @if (more()) {
                        <button dma-tab [panel]="inventory">Inventory</button>
                        <button dma-tab [panel]="features">Features</button>
                        <button dma-tab [panel]="notes">Notes</button>
                    }
                </dma-tab-list>
                <dma-tab-panel #overview>The overview of the character.</dma-tab-panel>
                <dma-tab-panel #stats>The ability scores of the character.</dma-tab-panel>
                <dma-tab-panel #spells>The spells the character knows.</dma-tab-panel>
                <dma-tab-panel #inventory>What the character carries.</dma-tab-panel>
                <dma-tab-panel #features>The class features of the character.</dma-tab-panel>
                <dma-tab-panel #notes>Whatever the player wants to remember.</dma-tab-panel>
            </div>
        `,
        styles: `
            .container {
                width: 320px;
            }
        `,
        imports: [TabComponent, TabListComponent, TabPanelComponent],
    })
    class ChangingTestComponent {
        public readonly more = signal(false);
        public readonly firstLabel = signal('Overview');
    }

    /** Restores the motion preference of the browser, which a test may emulate. */
    afterEach(async () => {
        await preferReducedMotion(false);
    });

    /** Emulates the reader's preference for reduced motion, or drops it. */
    async function preferReducedMotion(reduce: boolean) {
        await cdp().send('Emulation.setEmulatedMedia', {
            features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : '' }],
        });
    }

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

        it('should draw its hover look', async () => {
            const { harness } = await setupTest();
            const tab = page.getByRole('tab', { name: 'Stats' });

            await userEvent.hover(tab);
            const look = await (await harness.getTab('Stats')).getLook();
            await userEvent.unhover(tab);

            expect(look).toEqual(readLooks().hover);
        });

        it('should keep the indicator of the selected tab on hover', async () => {
            const { harness } = await setupTest();
            const tab = page.getByRole('tab', { name: 'Overview' });

            await userEvent.hover(tab);
            const look = await (await harness.getTab('Overview')).getLook();
            const indicator = await (await harness.getTab('Overview')).getIndicator();
            await userEvent.unhover(tab);

            expect(look).toEqual(readLooks().hover);
            expect(indicator).not.toBeNull();
        });

        it('should draw no focus ring until it has focus', async () => {
            const { harness } = await setupTest();

            expect((await (await harness.getTab('Overview')).getFocusRing()).style).toBe('none');
        });

        it('should draw the focus ring outside itself on keyboard focus, and keep its look', async () => {
            const { harness } = await setupTest();
            const tab = await harness.getTab('Overview');

            await userEvent.tab();

            expect(await tab.isFocused()).toBe(true);
            expect(await tab.getFocusRing()).toEqual(readFocusRing());
            expect(await tab.getLook()).toEqual(readLooks().selected);
            expect(await tab.getIndicator()).not.toBeNull();
        });

        it('should draw no focus ring when a click focuses it', async () => {
            const { harness } = await setupTest();
            const tab = await harness.getTab('Stats');

            await userEvent.click(page.getByRole('tab', { name: 'Stats' }));

            expect(await tab.isFocused()).toBe(true);
            expect((await tab.getFocusRing()).style).toBe('none');
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

    describe('tab panel', () => {
        it('should draw no focus ring until it has focus', async () => {
            const { panels } = await setupTest();

            expect((await panels[0]?.getFocusRing())?.style).toBe('none');
        });

        it('should draw the focus ring outside itself on keyboard focus', async () => {
            const { panels } = await setupTest();

            await userEvent.tab();
            await userEvent.tab();

            expect(await panels[0]?.isFocused()).toBe(true);
            expect(await panels[0]?.getFocusRing()).toEqual(readFocusRing());
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

        it('should leave room for the focus ring of a tab at its edge', async () => {
            const { harness } = await setupTest();

            await userEvent.tab();

            expect((await (await harness.getTab('Overview')).getFocusRing()).style).toBe('solid');
            expect(await harness.isFocusRingInView('Overview')).toBe(true);
        });

        it('should scroll the focus ring of a tab the keys reach into view with the tab', async () => {
            const { harness } = await setupTestEnvironment({ host: OverflowTestComponent, harness: TabListHarness });

            await preferReducedMotion(true);
            await userEvent.tab();
            await userEvent.keyboard('{End}');

            expect((await (await harness.getTab('Spells')).getFocusRing()).style).toBe('solid');
            expect(await harness.isFocusRingInView('Spells')).toBe(true);
        });

        it('should scroll a tab the keys reach into view', async () => {
            const { harness } = await setupTestEnvironment({ host: OverflowTestComponent, harness: TabListHarness });

            expect(await harness.isTabInView('Spells')).toBe(false);

            await preferReducedMotion(true);
            await (await harness.getTab('Overview')).focus();
            await userEvent.keyboard('{End}');

            expect(await harness.isTabInView('Spells')).toBe(true);

            await userEvent.keyboard('{Home}');

            expect(await harness.isTabInView('Overview')).toBe(true);
        });
    });

    /** Sets up the host whose tabs scroll, once its tab list has measured itself. */
    async function setupScrollTest() {
        const { fixture, harness } = await setupTestEnvironment({
            host: ScrollTestComponent,
            harness: TabListHarness,
        });
        const scroller = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.tabs');

        if (!scroller) {
            throw new Error('The tab list has no element that scrolls its tabs.');
        }
        // The list measures itself once the browser lays it out.
        await expect.poll(async () => (await harness.getFade()).end).toEqual(FADE);

        return { fixture, harness, scroller };
    }

    /**
     * Waits for the list to follow a change, through the frame in which the browser reports sizes and the change
     * detection that follows it.
     */
    async function settle() {
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        await TestBed.inject(ApplicationRef).whenStable();
    }

    /** Selects the tab labeled `label` from `source`. A key reaches it from the selected tab with End. */
    async function select(
        fixture: { componentInstance: { selected: WritableSignal<number> } },
        harness: TabListHarness,
        source: SelectionSource,
        label: string,
    ) {
        if (source === 'outside') {
            fixture.componentInstance.selected.set(SCROLL_LABELS.indexOf(label));
            await TestBed.inject(ApplicationRef).whenStable();
        } else if (source === 'click') {
            await (await harness.getTab(label)).click();
        } else {
            await (await harness.getTab((await harness.getSelectedLabel()) ?? '')).focus();
            await userEvent.keyboard('{End}');
            await TestBed.inject(ApplicationRef).whenStable();
        }
    }

    /** Scrolls the tabs to `left`, or to the end, and waits for the list to follow. */
    async function scrollTo(scroller: HTMLElement, left: number | 'end') {
        scroller.scrollTo({ left: left === 'end' ? scroller.scrollWidth : left, behavior: 'instant' });
        await new Promise(requestAnimationFrame);
        await TestBed.inject(ApplicationRef).whenStable();
    }

    /** The left edge in pixels of each tab. */
    async function readTabLefts(harness: TabListHarness) {
        const tabs = await harness.getTabs();

        return await Promise.all(tabs.map(async (tab) => (await (await tab.host()).getDimensions()).left));
    }

    /** The scroll button over `edge`, which the test expects to show. */
    async function getScrollButton(harness: TabListHarness, edge: TabListEdge) {
        const button = await harness.getScrollButton(edge);

        if (!button) {
            throw new Error(`The tab list shows no scroll button at its ${edge}.`);
        }
        return button;
    }

    /** The scroll button over `edge` as a locator, to press it with a real pointer. */
    function locateScrollButton(scroller: HTMLElement, edge: TabListEdge) {
        const button = scroller.parentElement?.querySelector(`.scroll-button.${edge}`);

        if (!button) {
            throw new Error(`The tab list shows no scroll button at its ${edge}.`);
        }
        return page.elementLocator(button);
    }

    /** The label of the first tab, counted from `edge`, that does not show clear of the scroll buttons. */
    async function findHiddenLabel(harness: TabListHarness, edge: TabListEdge) {
        const labels = edge === 'start' ? SCROLL_LABELS : [...SCROLL_LABELS].reverse();

        for (const label of labels) {
            if (!(await harness.isTabClear(label))) {
                return label;
            }
        }
        throw new Error('Every tab shows clear of the scroll buttons.');
    }

    describe('overflow', () => {
        it('should fade neither end while the tabs fit', async () => {
            const { harness } = await setupTest();

            expect(await harness.getFade()).toEqual({ start: null, end: null });
        });

        it('should fade the end alone while the tabs start at the start', async () => {
            const { harness } = await setupScrollTest();

            expect(await harness.getFade()).toEqual({ start: null, end: FADE });
        });

        it('should fade both ends while more tabs lie past both', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 100);

            expect(await harness.getFade()).toEqual({ start: FADE, end: FADE });
        });

        it('should fade the start alone once the tabs reach the end', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 'end');

            expect(await harness.getFade()).toEqual({ start: FADE, end: null });
        });

        it('should follow the list as its container resizes', async () => {
            const { fixture, harness } = await setupScrollTest();

            fixture.componentInstance.width.set(1000);

            await expect.poll(async () => await harness.getFade()).toEqual({ start: null, end: null });

            fixture.componentInstance.width.set(320);

            await expect.poll(async () => await harness.getFade()).toEqual({ start: null, end: FADE });
        });

        it('should leave the tabs where they are as the start of the list fades', async () => {
            const { harness, scroller } = await setupScrollTest();
            const before = await readTabLefts(harness);

            await scrollTo(scroller, 8);
            const after = await readTabLefts(harness);

            expect(await harness.getFade()).toEqual({ start: FADE, end: FADE });
            expect(after.map((left, index) => Math.round((before[index] ?? 0) - left))).toEqual(
                SCROLL_LABELS.map(() => 8),
            );
        });

        it('should scroll a tab the keys reach clear of the fades', async () => {
            const { harness } = await setupScrollTest();

            await preferReducedMotion(true);
            await (await harness.getTab('Overview')).focus();

            for (const label of SCROLL_LABELS.slice(1)) {
                await userEvent.keyboard('{ArrowRight}');

                expect(await harness.getFocusedLabel()).toBe(label);
                // The fades follow the scroll a frame later.
                await expect.poll(async () => await harness.isTabClear(label)).toBe(true);
            }
        });
    });

    describe('selected tab', () => {
        /**
         * The tab each source selects, out of view while the list starts at the start: a tab past the end of the list
         * for a change from outside, the last tab for End, and for a click, the first tab that shows only in part.
         */
        async function findTarget(harness: TabListHarness, source: SelectionSource) {
            switch (source) {
                case 'outside':
                    return 'Features';
                case 'key':
                    return 'Notes';
                case 'click':
                    return await findHiddenLabel(harness, 'start');
            }
        }

        /** The label of the first tab that shows clear of the fades and isn't selected. */
        async function findClearLabel(harness: TabListHarness) {
            const selected = await harness.getSelectedLabel();

            for (const label of SCROLL_LABELS) {
                if (label !== selected && (await harness.isTabClear(label))) {
                    return label;
                }
            }
            throw new Error('No tab but the selected one shows clear of the fades.');
        }

        /** Whether the tab labeled `label` shows clear of the fades, with room for its focus ring. */
        async function isRevealed(harness: TabListHarness, label: string) {
            return (await harness.isTabClear(label)) && (await harness.isFocusRingInView(label));
        }

        it('should start on a tab past its edge fully in view, without a smooth scroll', async () => {
            const { harness } = await setupTestEnvironment({
                host: ScrollTestComponent,
                harness: TabListHarness,
                providers: [{ provide: START, useValue: SCROLL_LABELS.indexOf('Features') }],
            });

            await settle();

            expect(await harness.getSelectedLabel()).toBe('Features');
            expect(await isRevealed(harness, 'Features')).toBe(true);
        });

        it.each<SelectionSource>(['outside', 'click', 'key'])(
            'should scroll a tab selected by %s fully into view, smoothly',
            async (source) => {
                const { fixture, harness } = await setupScrollTest();
                const label = await findTarget(harness, source);

                expect(await harness.isTabClear(label)).toBe(false);

                await select(fixture, harness, source, label);

                expect(await harness.getSelectedLabel()).toBe(label);
                expect(await harness.isTabClear(label)).toBe(false);
                await expect.poll(async () => await isRevealed(harness, label)).toBe(true);
            },
        );

        it.each<SelectionSource>(['outside', 'click', 'key'])(
            'should scroll a tab selected by %s fully into view at once when the reader prefers reduced motion',
            async (source) => {
                const { fixture, harness } = await setupScrollTest();
                const label = await findTarget(harness, source);

                await preferReducedMotion(true);
                await select(fixture, harness, source, label);
                // The fades follow the scroll a frame later, long before a smooth scroll would end.
                await settle();

                expect(await isRevealed(harness, label)).toBe(true);
            },
        );

        it.each<Exclude<SelectionSource, 'key'>>(['outside', 'click'])(
            'should leave the list where it is when %s selects a tab already fully in view',
            async (source) => {
                const { fixture, harness, scroller } = await setupScrollTest();

                await scrollTo(scroller, 100);
                const label = await findClearLabel(harness);

                await select(fixture, harness, source, label);
                await settle();

                expect(await harness.getSelectedLabel()).toBe(label);
                expect(scroller.scrollLeft).toBe(100);
            },
        );

        it.each<SelectionSource>(['outside', 'click', 'key'])(
            'should neither scroll the page nor move the focus when %s selects a tab',
            async (source) => {
                const { fixture, harness } = await setupTestEnvironment({
                    host: PageTestComponent,
                    harness: TabListHarness,
                });
                const host = fixture.nativeElement as HTMLElement;
                const scrollingPage = host.querySelector<HTMLElement>('.page');
                const elsewhere = host.querySelector<HTMLElement>('button:not([dma-tab])');

                if (!scrollingPage || !elsewhere) {
                    throw new Error('The page host lacks its page or its button.');
                }
                await settle();
                await preferReducedMotion(true);

                if (source === 'key') {
                    // Focusing the tab scrolls the page to it, so the page scrolls back before the key.
                    await (await harness.getTab('Overview')).focus();
                    scrollingPage.scrollTop = 0;
                } else {
                    elsewhere.focus();
                }
                await select(fixture, harness, source, 'Notes');
                await settle();

                expect(await harness.isTabClear('Notes')).toBe(true);
                expect(scrollingPage.scrollTop).toBe(0);
                if (source === 'key') {
                    expect(await harness.getFocusedLabel()).toBe('Notes');
                } else {
                    expect(document.activeElement).toBe(elsewhere);
                }
            },
        );
    });

    describe('scroll buttons', () => {
        it('should show none while the tabs fit', async () => {
            const { harness } = await setupTest();

            expect(await harness.getScrollButtonEdges()).toEqual([]);
        });

        it('should show one at the end alone while the tabs start at the start', async () => {
            const { harness } = await setupScrollTest();

            expect(await harness.getScrollButtonEdges()).toEqual(['end']);
        });

        it('should show one at each end while more tabs lie past both', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 100);

            expect(await harness.getScrollButtonEdges()).toEqual(['start', 'end']);
        });

        it('should show one at the start alone once the tabs reach the end', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 'end');

            expect(await harness.getScrollButtonEdges()).toEqual(['start']);
        });

        it('should follow the list as its container resizes', async () => {
            const { fixture, harness } = await setupScrollTest();

            fixture.componentInstance.width.set(1000);

            await expect.poll(async () => await harness.getScrollButtonEdges()).toEqual([]);

            fixture.componentInstance.width.set(320);

            await expect.poll(async () => await harness.getScrollButtonEdges()).toEqual(['end']);
        });

        it('should show the chevron that points the way each scrolls', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 100);

            expect(await (await getScrollButton(harness, 'start')).getGlyph()).toBe('chevron-left');
            expect(await (await getScrollButton(harness, 'end')).getGlyph()).toBe('chevron-right');
        });

        it('should stay out of the tab order and the accessibility tree', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 100);

            for (const edge of ['start', 'end'] as const) {
                const button = await getScrollButton(harness, edge);

                expect(await button.getType()).toBe('button');
                expect(await button.getTabIndex()).toBe('-1');
                expect(await button.isHidden()).toBe(true);
            }
            expect(page.getByRole('button').elements()).toHaveLength(0);
        });

        it('should draw the quiet look, with no border or focus ring', async () => {
            const { harness } = await setupScrollTest();

            expect(await (await getScrollButton(harness, 'end')).getLook()).toEqual({
                background: TRANSPARENT,
                color: readColorToken('--color-foreground-muted'),
                borderStyle: 'none',
                outlineStyle: 'none',
            });
        });

        it('should draw its hover look', async () => {
            const { harness, scroller } = await setupScrollTest();
            const button = locateScrollButton(scroller, 'end');

            await userEvent.hover(button);
            const look = await (await getScrollButton(harness, 'end')).getLook();
            await userEvent.unhover(button);

            expect(look).toEqual({
                background: readColorToken('--color-background-hover'),
                color: readColorToken('--color-foreground-default'),
                borderStyle: 'none',
                outlineStyle: 'none',
            });
        });

        it('should lie over each end beside the tabs, at the minimum target size', async () => {
            const { harness, scroller } = await setupScrollTest();

            await scrollTo(scroller, 100);

            expect(await harness.getScrollButtonBox('start')).toEqual({
                left: 4,
                top: 4,
                width: 44,
                height: 44,
                borderRadius: '8px',
            });
            expect(await harness.getScrollButtonBox('end')).toEqual({
                left: 320 + 4 - 44,
                top: 4,
                width: 44,
                height: 44,
                borderRadius: '8px',
            });
        });

        it.each<TabListEdge>(['end', 'start'])(
            'should scroll the next tab past the %s fully into view on a click',
            async (edge) => {
                const { harness, scroller } = await setupScrollTest();

                await preferReducedMotion(true);
                if (edge === 'start') {
                    await scrollTo(scroller, 'end');
                }
                const label = await findHiddenLabel(harness, edge === 'end' ? 'start' : 'end');

                await (await getScrollButton(harness, edge)).click();

                expect(await harness.isTabClear(label)).toBe(true);
            },
        );

        it('should scroll smoothly unless the reader prefers reduced motion', async () => {
            const { harness } = await setupScrollTest();
            const label = await findHiddenLabel(harness, 'start');

            await (await getScrollButton(harness, 'end')).click();

            expect(await harness.isTabClear(label)).toBe(false);
            await expect.poll(async () => await harness.isTabClear(label)).toBe(true);
        });

        it('should leave the focus and the selection where they were on a press', async () => {
            const { harness, scroller } = await setupScrollTest();

            await userEvent.tab();
            await userEvent.click(locateScrollButton(scroller, 'end'));

            expect(await harness.getFocusedLabel()).toBe('Overview');
            expect(await harness.getSelectedLabel()).toBe('Overview');
        });

        describe('as the tabs change', () => {
            /**
             * Sets up the host whose tabs change, once its tab list has measured itself. The browser reports sizes after
             * the frame callbacks of the frame that lays the list out, so the setup waits for the frame after it.
             */
            async function setupChangingTest() {
                const { fixture, harness } = await setupTestEnvironment({
                    host: ChangingTestComponent,
                    harness: TabListHarness,
                });

                await new Promise(requestAnimationFrame);
                await new Promise(requestAnimationFrame);
                await TestBed.inject(ApplicationRef).whenStable();

                return { fixture, harness };
            }

            it('should show the end button once added tabs no longer fit', async () => {
                const { fixture, harness } = await setupChangingTest();

                expect(await harness.getScrollButtonEdges()).toEqual([]);

                fixture.componentInstance.more.set(true);

                await expect.poll(async () => await harness.getScrollButtonEdges()).toEqual(['end']);
                expect(await harness.getFade()).toEqual({ start: null, end: FADE });
            });

            it('should hide the buttons once the tabs left after a removal fit', async () => {
                const { fixture, harness } = await setupChangingTest();

                fixture.componentInstance.more.set(true);

                await expect.poll(async () => await harness.getScrollButtonEdges()).toEqual(['end']);

                fixture.componentInstance.more.set(false);

                await expect.poll(async () => await harness.getScrollButtonEdges()).toEqual([]);
                expect(await harness.getFade()).toEqual({ start: null, end: null });
            });

            it('should show the end button once a tab grows too wide for the tabs to fit', async () => {
                const { fixture, harness } = await setupChangingTest();

                fixture.componentInstance.firstLabel.set('Overview of the character and their background');

                await expect.poll(async () => await harness.getScrollButtonEdges()).toEqual(['end']);
            });
        });
    });
});
