# Design tokens

The design tokens of D&D Mapp, which the [design system](../../docs/design.md) in Penpot holds: the colors, sizes, type, and shadows that every component and theme reads. [ADR 0001](../../docs/adr/0001-ui-and-token-packages.md) records why the tokens live in a package of their own.

`tokens.json` is the single-file token export of the Design system file, committed as Penpot writes it. Change a token in Penpot and export it again, as [Design tokens](../../docs/design.md#design-tokens) describes, rather than editing the file.

The package has no tasks yet. [Generate CSS custom properties from the Penpot tokens](https://github.com/dnd-mapp/dnd-mapp/issues/207) adds the build that turns `tokens.json` into CSS custom properties, so the projects of any platform can read them. [ADR 0006](../../docs/adr/0006-design-token-pipeline.md) records how that pipeline works and why, and [ADR 0008](../../docs/adr/0008-theme-mapping.md) how the themes switch.
