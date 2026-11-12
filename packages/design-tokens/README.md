# Design tokens

The design tokens of D&D Mapp, which the [design system](../../docs/design.md) in Penpot holds: the colors, sizes, type, and shadows that every component and theme reads. The package will hold the token export of Penpot and the CSS custom properties generated from it, so the projects of any platform can read them. [ADR 0001](../../docs/adr/0001-ui-and-token-packages.md) records why the tokens live in a package of their own.

The package is empty for now. [Build the design system in code](https://github.com/dnd-mapp/dnd-mapp/issues/199) adds the token pipeline and its tasks. [ADR 0006](../../docs/adr/0006-design-token-pipeline.md) records how that pipeline works and why, and [ADR 0008](../../docs/adr/0008-theme-mapping.md) how the themes switch.
