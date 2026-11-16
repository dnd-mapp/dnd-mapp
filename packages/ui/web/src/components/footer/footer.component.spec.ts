import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { FooterComponent } from './footer.component';
import { LinkComponent } from '../link';
import { LinkGroupComponent } from '../link-group';
import { FooterHarness, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

const LICENSE = '© D&D Mapp contributors. Released under the MIT License.';

const ATTRIBUTION =
    'This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") by Wizards of the Coast LLC ' +
    'and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the ' +
    'Creative Commons Attribution 4.0 International License available at ' +
    'https://creativecommons.org/licenses/by/4.0/legalcode.';

describe('FooterComponent', () => {
    @Component({
        template: `
            <footer dma-footer>
                <nav aria-labelledby="footer-product">
                    <dma-link-group>
                        <h2 id="footer-product">Product</h2>
                        <li><a dma-link kind="quiet" href="#">Compendium</a></li>
                        <li><a dma-link kind="quiet" href="#">Dice</a></li>
                        <li><a dma-link kind="quiet" href="#">Characters</a></li>
                        <li><a dma-link kind="quiet" href="#">Campaigns</a></li>
                    </dma-link-group>
                </nav>
                <nav aria-labelledby="footer-project">
                    <dma-link-group>
                        <h2 id="footer-project">Project</h2>
                        <li><a dma-link kind="quiet" href="#">GitHub</a></li>
                        <li><a dma-link kind="quiet" href="#">Contributing</a></li>
                    </dma-link-group>
                </nav>
                <nav aria-labelledby="footer-legal">
                    <dma-link-group>
                        <h2 id="footer-legal">Legal</h2>
                        <li><a dma-link kind="quiet" href="#">Privacy</a></li>
                    </dma-link-group>
                </nav>
                <p>Not a column</p>
            </footer>
        `,
        imports: [FooterComponent, LinkGroupComponent, LinkComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: FooterHarness });

        TestBed.tick();

        return { harness };
    }

    it('should be the contentinfo landmark of the page', async () => {
        await setupTest();

        await expect.element(page.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should project each column as a navigation named by its heading, in order', async () => {
        const { harness } = await setupTest();
        const groups = await harness.getLinkGroups();

        expect(await Promise.all(groups.map((group) => group.getHeadingText()))).toEqual([
            'Product',
            'Project',
            'Legal',
        ]);
        for (const name of ['Product', 'Project', 'Legal']) {
            await expect.element(page.getByRole('navigation', { name, exact: true })).toBeInTheDocument();
        }
    });

    it('should drop projected content other than the columns', async () => {
        await setupTest();

        await expect.element(page.getByText('Not a column')).not.toBeInTheDocument();
    });

    it('should show the small full logo and the tagline as its brand', async () => {
        const { harness } = await setupTest();
        const logo = await harness.getLogo();

        expect(await logo.getName()).toBe('D&D Mapp');
        expect(await logo.getWordmarkText()).toBe('D&D Mapp');
        expect(await logo.getMarkSize()).toEqual({ width: 32, height: 32 });
        expect(await harness.getText('tagline')).toBe(
            'An open-source app for players and dungeon masters of D&D 5th edition.',
        );
    });

    it('should show the license line and the SRD 5.1 attribution word for word', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('license')).toBe(LICENSE);
        expect(await harness.getText('attribution')).toBe(ATTRIBUTION);
    });

    it('should link both URLs of the attribution, underlined', async () => {
        const { harness } = await setupTest();
        const urls = [
            'https://dnd.wizards.com/resources/systems-reference-document',
            'https://creativecommons.org/licenses/by/4.0/legalcode',
        ];

        expect(await harness.getAttributionLinks()).toEqual(
            urls.map((url) => ({ text: url, href: url, underlined: true })),
        );
    });

    it('should draw its background, the divider line, and its own texts from the tokens', async () => {
        const { harness } = await setupTest();
        const muted = { color: readColorToken('--color-foreground-muted'), fontSize: '14px' };
        const look = await harness.getLook();

        expect(look.background).toBe(readColorToken('--color-background-footer'));
        expect(look.dividerColor).toBe(readColorToken('--color-border-divider'));
        expect(look.dividerWidth).toBe('1px');
        for (const part of ['tagline', 'license', 'attribution'] as const) {
            expect(await harness.getTextLook(part)).toEqual(muted);
        }
    });

    it('should wrap the tagline within 300 px', async () => {
        const { harness } = await setupTest();
        const tagline = await harness.getBox('tagline');

        expect(tagline.width).toBeLessThanOrEqual(300);
        expect(tagline.height).toBeGreaterThan(30);
    });

    describe('on narrow screens', () => {
        it('should pad itself 48 px above and below, and 20 px at the sides', async () => {
            const { harness } = await setupTest();

            expect((await harness.getLook()).padding).toBe('48px 20px');
        });

        it('should stack the brand and the columns 32 px apart', async () => {
            const { harness } = await setupTest();
            const [brand, groups, columns] = await Promise.all([
                harness.getBox('brand'),
                harness.getBox('groups'),
                harness.getColumnBoxes(),
            ]);

            expect(brand.top).toBe(48);
            expect(brand.left).toBe(20);
            expect(groups.top - (brand.top + brand.height)).toBeCloseTo(32);
            expect(columns).toHaveLength(3);
            for (const [index, column] of columns.entries()) {
                const previous = columns[index - 1];

                expect(column.left).toBe(20);
                if (previous) {
                    expect(column.top - (previous.top + previous.height)).toBeCloseTo(32);
                }
            }
        });

        it('should put the divider 32 px below the columns and above the legal text', async () => {
            const { harness } = await setupTest();
            const [groups, bottom, legal] = await Promise.all([
                harness.getBox('groups'),
                harness.getBox('bottom'),
                harness.getBox('legal'),
            ]);

            expect(bottom.top - (groups.top + groups.height)).toBeCloseTo(32);
            expect(legal.top - bottom.top).toBeCloseTo(33);
        });
    });
});
