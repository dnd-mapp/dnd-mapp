import type { Meta, StoryObj } from '@storybook/angular-vite';
import { DataTableComponent } from './data-table.component';

const meta = {
    title: 'Data table',
    component: DataTableComponent,
    render: () => ({
        template: `
            <table dma-data-table>
                <caption>Data we process</caption>
                <colgroup>
                    <col class="data" />
                    <col />
                    <col class="legal-basis" />
                    <col class="kept-for" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">Data</th>
                        <th scope="col">Why</th>
                        <th scope="col">Legal basis</th>
                        <th scope="col">Kept for</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Server logs</th>
                        <td>
                            Your IP address, the time, the page you asked for, the page you came from, and your browser.
                            We use them to deliver pages, find errors, and stop abuse.
                        </td>
                        <td>Legitimate interest, GDPR art. 6(1)(f)</td>
                        <td>14 days</td>
                    </tr>
                    <tr>
                        <th scope="row">Bot check</th>
                        <td>
                            Cloudflare runs a script and sets the cf_clearance cookie to tell people from bots and protect
                            the site from abuse.
                        </td>
                        <td>Legitimate interest, GDPR art. 6(1)(f)</td>
                        <td>6 months, in your browser</td>
                    </tr>
                    <tr>
                        <th scope="row">Theme choice</th>
                        <td>
                            Dark or Light, if you pick one, so the next visit opens in that theme. It stays in your
                            browser's local storage and is never sent to us.
                        </td>
                        <td>None needed: it stays on your device</td>
                        <td>Until you pick System or clear your site data</td>
                    </tr>
                    <tr>
                        <th scope="row">Emails to us</th>
                        <td>Your address and what you write, so we can answer you.</td>
                        <td>Legitimate interest, GDPR art. 6(1)(f)</td>
                        <td>1 year after your question is resolved</td>
                    </tr>
                </tbody>
            </table>
        `,
        // The widths of the columns on the Penpot instance, each with the padding of its cells.
        styles: [
            `
                .data {
                    inline-size: 10.375rem;
                }

                .legal-basis {
                    inline-size: 9.75rem;
                }

                .kept-for {
                    inline-size: 9.5rem;
                }
            `,
        ],
    }),
} satisfies Meta<DataTableComponent>;

export default meta;

type Story = StoryObj<DataTableComponent>;

/** A table under a header row, which fills its container up to the measure, with the column widths of Penpot. */
export const Desktop: Story = {};
