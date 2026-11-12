# Design

This guide says where the designs of D&D Mapp live, who can open them, and how a design becomes code. [Architecture](architecture.md) covers where that code goes.

## Where the designs live

The designs live in [Penpot](https://penpot.app), in the D&D Mapp project of the D&D Mapp team. Each file has a view link that opens without a Penpot account:

| File                       | Pages                          | Holds                                                                                                                            | View link             |
|:---------------------------|:-------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:----------------------|
| Design system              | Foundations, Components, Brand | The design tokens, the components with the build status of each, and the logo with the favicons and Open Graph image of the app. | [Open][design-system] |
| Desktop                    | Landing page                   | The wireframes of the landing page at desktop widths.                                                                            | [Open][desktop]       |
| Mobile                     | Landing page                   | The wireframes of the landing page at mobile widths.                                                                             | [Open][mobile]        |
| Landing page · exploration | Mood board, Wireframe          | The mood board and the first wireframe of the landing page.                                                                      | [Open][exploration]   |

The design system is a shared library: Desktop and Mobile use its components, so a change to a component reaches every page that uses it.

## Who can open them

Anyone can open the view links and use their Inspect tab to read the sizes, colors, and CSS of each shape. Only members of the D&D Mapp team can edit or comment on the files; ask a [maintainer](../GOVERNANCE.md#maintainers) when you need access.

## Source of truth

Penpot decides how the app looks: its tokens, its layouts, and the variants and states that the design system draws. The code decides what the designs leave out, such as behavior, accessibility, and states that no design shows yet. When the code needs to look different from its design, change the design first, so Penpot never falls behind the code.

## From design to code

The Component inventory board, on the Components page of the design system, lists each component in build order with its status:

| Status   | Means                               |
|:---------|:------------------------------------|
| Planned  | Listed, but not designed yet.       |
| Designed | Drawn in Penpot, but not built yet. |
| In code  | Built in the repository.            |

Build a component once it is Designed, and give it the name it has in Penpot, so either side finds the other: the Nav link component becomes `dma-nav-link`. After its pull request merges, a team member sets the component to In code.

## Design tokens

The Design system file holds the design tokens, and [`@dnd-mapp/design-tokens`](../packages/design-tokens/README.md) keeps them in `tokens.json`, the single-file export of that file, and in `tokens.css`, the CSS custom properties generated from it. [ADR 0006](adr/0006-design-token-pipeline.md) records how they reach the code. A token changes in Penpot first, as [Source of truth](#source-of-truth) asks, so never edit either file by hand. After you change a token, export the tokens again:

1. Open the Design system file, and switch the sidebar to the Tokens tab.
2. Choose **Tools** at the bottom of the tab, then **Export**, and pick **Single file**.
3. Save the export over `packages/design-tokens/tokens.json`, as it is.
4. Generate `tokens.css` from it with `pnpm moon run design-tokens:build`.
5. Commit both files in one pull request.

Components use the semantic tokens only, such as `--color-background-page`, never a primitive, such as `--color-neutral-19`. A primitive names a value of the palette or a scale, while a semantic token names its use, so a theme can change the value without touching the component. When a component needs a value that no semantic token holds, add the token in Penpot first. Review enforces the rule.

## With an agent

The Penpot MCP server lets an agent read and export the shapes of a file, but only of the file that a team member has open with the Penpot MCP plugin. Without that, give the agent the view links above.

[design-system]: https://design.penpot.app/?screen=viewer&file-id=17092c62-56e2-8122-8008-ed1d7fea5bf0&page-id=17092c62-56e2-8122-8008-ed1d7fea5bf1&section=interactions&index=0&share-id=a49bec04-2314-4983-ac4d-2f483f4d8e58
[desktop]: https://design.penpot.app/?screen=viewer&file-id=51f2d744-23b9-8138-8008-edd7e2c6e857&page-id=51f2d744-23b9-8138-8008-edd7e2c6e858&section=interactions&index=0&share-id=d2842485-5e56-40a8-9efe-df5a63d91d3c
[mobile]: https://design.penpot.app/?screen=viewer&file-id=110d30a4-9d92-80de-8008-edd7f79f65a1&page-id=110d30a4-9d92-80de-8008-edd7f79f65a2&section=interactions&index=0&share-id=ecd810d5-8de8-4fc6-9285-31c76e35bf13
[exploration]: https://design.penpot.app/?screen=viewer&file-id=275e4692-9a43-8087-8008-ecfce5bd5ca1&page-id=275e4692-9a43-8087-8008-ecfce5bd5ca2&section=interactions&index=0&share-id=3564107c-c9f0-42b8-be20-a6ac3fae426f
