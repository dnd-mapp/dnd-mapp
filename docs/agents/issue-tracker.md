# Issue Tracker

Issues are tracked in **GitHub Issues** using the `gh` CLI.

## Repository

`dnd-mapp/<repo-name>` — each sibling repo uses its own slug; adjust when running this skill there.

## GitHub Project

All issues must be added to the org-level project **"D&D Mapp"** (project number: 2).

```sh
gh issue create ...
gh project item-add 2 --owner dnd-mapp --url <issue-url>
```

## Issue types

- PRD issues → type **Feature**
- Task issues created from a PRD → type **Task**

## Story points

Use the **Story points** custom field on the project. Valid values: `0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100`.

If a single issue would be 8 or more points, break it into smaller issues instead.

## Relationships

Use GitHub's native relationship features — do not describe blockers or parent issues in the issue body.

- **Parent/child hierarchy** — use sub-issues (a Task issue is a sub-issue of its parent Feature)
- **Blocking/blocked-by** — use GitHub's blocking relationship on the issue
