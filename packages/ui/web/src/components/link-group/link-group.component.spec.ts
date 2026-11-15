import { Component, type Type } from '@angular/core';
import { page } from 'vitest/browser';
import { LinkGroupComponent } from './link-group.component';
import { LinkComponent } from '../link';
import { LinkGroupHarness, readColorToken, setupTestEnvironment } from '@dnd-mapp/ui-web/testing';

/** Makes the container wider than the link group, so the width test can tell the two apart. */
const CONTAINER = `
    .container {
        width: 600px;
    }
`;

describe('LinkGroupComponent', () => {
    @Component({
        template: `
            <div class="container">
                <dma-link-group>
                    <h3>Project</h3>
                    <li><a dma-link kind="quiet" href="#">Source code</a></li>
                    <li><a dma-link kind="quiet" href="#">Changelog</a></li>
                    <li><a dma-link kind="quiet" href="#">License</a></li>
                </dma-link-group>
            </div>
        `,
        styles: CONTAINER,
        imports: [LinkGroupComponent, LinkComponent],
    })
    class TestComponent {}

    @Component({
        template: `
            <div class="container">
                <dma-link-group>
                    <h2>Rules</h2>
                    @for (link of links; track link) {
                        <li>
                            <a dma-link kind="quiet" href="#">{{ link }}</a>
                        </li>
                    }
                </dma-link-group>
            </div>
        `,
        styles: CONTAINER,
        imports: [LinkGroupComponent, LinkComponent],
    })
    class RepeatedLinksTestComponent {
        public readonly links = ['Spells', 'Monsters'];
    }

    async function setupTest(host: Type<unknown> = TestComponent) {
        const { harness } = await setupTestEnvironment({ host, harness: LinkGroupHarness });

        return { harness };
    }

    it('should project the heading and the links in their order', async () => {
        const { harness } = await setupTest();
        const links = await harness.getLinks();

        expect(await harness.getHeadingText()).toBe('Project');
        expect(await Promise.all(links.map((link) => link.getText()))).toEqual(['Source code', 'Changelog', 'License']);
    });

    it('should keep the heading at the level its consumer picks', async () => {
        await setupTest();

        await expect.element(page.getByRole('heading', { level: 3, name: 'Project', exact: true })).toBeInTheDocument();
    });

    it('should render the links as a list, one link per item', async () => {
        await setupTest();
        const list = page.getByRole('list');

        expect(list.getByRole('listitem').elements()).toHaveLength(3);
        expect(list.getByRole('link').elements()).toHaveLength(3);
        await expect.element(list.getByRole('listitem').nth(1)).toHaveTextContent('Changelog');
    });

    it('should list the items that a @for block projects', async () => {
        const { harness } = await setupTest(RepeatedLinksTestComponent);
        const links = await harness.getLinks();

        expect(await Promise.all(links.map((link) => link.getText()))).toEqual(['Spells', 'Monsters']);
        expect(page.getByRole('list').getByRole('listitem').elements()).toHaveLength(2);
    });

    it.each([
        { level: 'an h3', host: TestComponent },
        { level: 'an h2', host: RepeatedLinksTestComponent },
    ])('should draw $level heading in the caps typography', async ({ host }) => {
        const { harness } = await setupTest(host);

        expect(await harness.getHeadingLook()).toEqual({
            color: readColorToken('--color-foreground-default'),
            fontWeight: '600',
            textTransform: 'uppercase',
        });
    });

    it('should space the list 16 px below the heading, and the links 8 px apart, with no margins', async () => {
        const { harness } = await setupTest();
        const [heading, list, items] = await Promise.all([
            harness.getHeadingBox(),
            harness.getListBox(),
            harness.getItemBoxes(),
        ]);

        const gaps = items.slice(1).map((item, index) => item.top - (items[index]?.bottom ?? Number.NaN));

        expect(heading.top).toBe(0);
        expect(list.top - heading.bottom).toBeCloseTo(16);
        expect(items[0]?.top).toBeCloseTo(list.top);
        expect(gaps).toHaveLength(2);
        for (const gap of gaps) {
            expect(gap).toBeCloseTo(8);
        }
    });

    it('should fill its container, while the heading and the links keep their own width', async () => {
        const { harness } = await setupTest();
        const [heading, items] = await Promise.all([harness.getHeadingBox(), harness.getItemBoxes()]);

        expect(await harness.getWidth()).toBe(600);
        expect(heading.width).toBeLessThan(600);
        for (const item of items) {
            expect(item.width).toBeLessThan(600);
        }
    });
});
