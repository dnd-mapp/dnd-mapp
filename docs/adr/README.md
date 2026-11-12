# Architecture decision records

Each architecture decision record (ADR) in this folder says why the workspace is built the way it is: what a choice protects, what it was weighed against, and when to weigh it again. The guides in [`docs/`](../README.md) say how the workspace works; an ADR says why.

## Decisions

| ADR                                             | Decision                                                       | Status   |
|:------------------------------------------------|:---------------------------------------------------------------|:---------|
| [0001](0001-ui-and-token-packages.md)           | Separate packages hold the UI components and the design tokens | Accepted |
| [0002](0002-named-pnpm-catalogs.md)             | Named pnpm catalogs, one per tool family, hold every version   | Accepted |
| [0003](0003-moon-tasks-and-dependency-rules.md) | moon runs every task and checks the dependency rules           | Accepted |
| [0004](0004-modules-compile-from-source.md)     | Apps compile the modules they import from source               | Accepted |
| [0005](0005-deploys-on-a-workflow-request.md)   | Watchtower updates a container only when a workflow asks it to | Accepted |

## When to write one

Record a decision in an ADR when all three hold:

- It is hard to reverse, since changing course later costs real work.
- A reader would be surprised by it without the context, and might "fix" it.
- It came out of a real trade-off between alternatives.

Skip the ADR when any of them is missing. The pull request that makes the change explains it well enough then.

## Adding an ADR

1. Copy the [template](#template) to a new file named `<number>-<slug>.md`: the next free four-digit number, then a few lowercase words joined by hyphens. Numbers follow the order in which ADRs land, so take the next free one again when another ADR merges before yours.
2. Fill in each section. Link the issues, pull requests, and primary sources behind the reasons, rather than restating them.
3. Add the ADR to the [Decisions](#decisions) table.
4. Link the ADR from each guide section that describes the choice, so a reader of the guide finds the reasons.

An ADR records a decision at the time it was made, so leave an accepted ADR as it is. To change the decision, add an ADR that supersedes it, and set the status of the old one to `Superseded by [<number>](<file>)`. Fixing a typo or a broken link needs no new ADR.

## Template

```markdown
# <Number>. <The decision, as a short sentence>

- **Status:** Accepted
- **Date:** <YYYY-MM-DD>
- **Built in:** <The pull request that built the choice>

## Context

<The problem, and the forces that shaped the decision.>

## Decision

<What was decided, and the reasons for it.>

## Alternatives

<Each option weighed, and why it lost.>

## Consequences

<What follows from the decision, the costs included.>

## Revisit when

<The signs that the reasons no longer hold.>
```

The date is the day the decision took effect: the merge date of the pull request that built the choice. An ADR that lands before the code takes its own merge date, and links the issue that builds the choice instead of a pull request.
