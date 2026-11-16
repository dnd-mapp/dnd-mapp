# 0012. Every Storybook build carries a `noindex` tag unless it opts out

- **Status:** Accepted
- **Supersedes:** Part of [0011](0011-storybook-on-github-pages.md)
- **Date:** 2026-11-16
- **Built in:** [#388](https://github.com/dnd-mapp/dnd-mapp/pull/388)

## Context

[ADR 0011](0011-storybook-on-github-pages.md) publishes the Storybook of `main` at <https://dnd-mapp.github.io/dnd-mapp/>, and a preview of each pull request under `pr/<number>/`. Each preview is a near-copy of the Storybook of `main`, so a search result can send people to an outdated preview, and the result goes dead once the pull request closes.

ADR 0011 relied on a `robots.txt` at the root of the site that disallows `/pr/`, which never takes effect: crawlers read `robots.txt` only at the root of a host, and `dnd-mapp.github.io` has no site of its own. Even at the root of the host, `robots.txt` would only stop the crawl. [Google indexes a disallowed URL](https://developers.google.com/search/docs/crawling-indexing/robots/intro) without its content when other pages link to it, and never fetches the page, so it never sees a `noindex` tag there. GitHub Pages sends no custom headers, so the `X-Robots-Tag` header is out too. Only the HTML of the pages can carry the signal.

## Decision

[`.storybook/main.ts`](../../packages/ui/web/.storybook/main.ts) adds `<meta name="robots" content="noindex">` to the head of the manager and of the preview, so `index.html` and `iframe.html` of every build carry it. A build leaves it out only when `INDEX_STORYBOOK` is `true`, which only the `Storybook` job of `Push main` sets. [CI](../ci.md#storybook) describes the jobs. The reasons:

- **The tag fails safe.** A preview, a local build, or a new job that forgets the variable stays out of search results. Only the Storybook of `main` can lose its indexing by mistake, which shows in search results and in the source of its pages.
- **moon keeps the two builds apart.** `ui-web:build-storybook` lists `$INDEX_STORYBOOK` as an input, so it never restores an indexable build for a preview from its cache, or the other way round.
- **The variable stays out of the bundle.** Storybook embeds each variable that starts with `STORYBOOK_` in the browser bundle, so the name leaves out that prefix.

The `publish-pages` action no longer writes `robots.txt`, since it cannot keep the previews out of search results. The rest of ADR 0011 stands.

## Alternatives

- **The `robots.txt` of ADR 0011.** It takes effect only at the root of the host, and even there it keeps out the content of a page, not its URL.
- **A `dnd-mapp.github.io` site that serves a `robots.txt` for the host.** It would disallow the crawl, which hides the `noindex` tag from crawlers and still lets the URLs show up in results.
- **The `X-Robots-Tag` header.** GitHub Pages sends no custom headers.
- **A tag that only the previews add.** A preview job, a local build, or a new job that misses the variable would then publish indexable pages.

## Consequences

- A preview already on `gh-pages` gets the tag with the next push to its pull request, and the next deploy of `main` removes the `robots.txt` from the site.
- Search engines see the tag only on pages they can crawl. A `robots.txt` of a future `dnd-mapp.github.io` site must not disallow `/dnd-mapp/pr/`.
- A job that publishes the Storybook of `main` from somewhere else has to set `INDEX_STORYBOOK` too, or `main` drops out of search results.

## Revisit when

- GitHub Pages lets a site set its own response headers.
- The site moves to a host whose root the org controls, such as a custom domain.
