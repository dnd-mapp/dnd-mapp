# Privacy

The Privacy page of the site tells visitors which personal data D&D Mapp processes, who else sees it, and how long it's kept. This guide lists where each of those promises is enforced, so a change to the site or its server keeps the page true. The page's text lives on the Privacy page of the Desktop file, as [Design](design.md#where-the-designs-live) describes.

## What the site processes

| Data                       | Where it's kept                                                                          | Kept for                              | Enforced by                                                                                                                                          |
|:---------------------------|:-----------------------------------------------------------------------------------------|:--------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Server logs                | The access log of nginx in the web image, which the host's journal stores in RAM.        | 14 days                               | The host's journald config: daily journal files, deleted after 13 days. The journal also empties at each reboot, and a 64 MB cap may delete earlier. |
| Bot check (`cf_clearance`) | A cookie in the visitor's browser, set by Cloudflare's JavaScript Detections.            | 6 months                              | Cloudflare, which sets the cookie's expiry. The [yearly check](#yearly-check) confirms it.                                                           |
| Theme choice (`dma-theme`) | `localStorage` in the visitor's browser. It never reaches the server.                    | Until the visitor picks System        | The web app, which removes the key when the visitor picks System, as [ADR 0008](adr/0008-theme-mapping.md) describes.                                |
| Emails to support          | A Gmail mailbox, which Cloudflare Email Routing forwards `support@dndmapp.nl.eu.org` to. | 1 year after the question is resolved | A maintainer, who deletes them by hand at the [yearly check](#yearly-check).                                                                         |

The nginx access log holds the visitor's IP address, the time, the page, the referrer, and the browser. The host accepts web traffic only from Cloudflare's IP ranges and trusts their `X-Forwarded-For` header, so the log holds the visitor's address rather than Cloudflare's. The health check stays out of the log, as [`nginx.conf`](../.docker/web/nginx.conf) shows.

## Who else sees it

- **Cloudflare** proxies every hostname, so it sees each request and the visitor's IP address, and it runs the bot check. It processes this data under its data processing agreement, and may transfer it to the US under the EU–US Data Privacy Framework.
- **Google** stores the support emails in Gmail, under its own privacy policy.
- **GitHub** processes the data of visitors who follow a link to it, under its own privacy statement.

## Yearly check

Each November, around the date the Privacy page names:

- [ ] In Gmail, delete every support email whose question was resolved more than a year ago, then empty them from the trash.
- [ ] Open <https://www.dndmapp.nl.eu.org> in a private window and check in the browser's dev tools that `cf_clearance` is still the only cookie, and that it expires after 6 months.
- [ ] In the same dev tools, check that the network tab shows no request to another company, apart from Cloudflare's `/cdn-cgi/challenge-platform/` script.
- [ ] Check that the host's list of Cloudflare's IP ranges matches <https://www.cloudflare.com/ips-v4/>.

## Changing what the site processes

When a change adds a kind of data, a cookie, a script, or a recipient, or changes how long data is kept, update the Privacy page, this guide, and the page's Last updated date in the same pull request.

The statement was published without a legal check, as [#293](https://github.com/dnd-mapp/dnd-mapp/issues/293#issuecomment-6883518077) records. Get one before the site adds accounts, analytics, or error monitoring, or processes any other personal data.
