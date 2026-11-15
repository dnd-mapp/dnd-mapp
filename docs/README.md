# Documentation

These guides cover the workspace as a whole. Each project's README covers the project itself, as the [Projects](../README.md#projects) section of the root README lists them.

| Guide                                       | Covers                                                                                        |
|:--------------------------------------------|:----------------------------------------------------------------------------------------------|
| [Development](development.md)               | The tools, the first run, the tasks of the whole repository, the git hooks, and editors.      |
| [Architecture](architecture.md)             | The kinds of projects, the dependency rules between them, and how to add a project.           |
| [Testing](testing.md)                       | How each kind of project runs its tests, the test tasks, and how to test a component.         |
| [Design](design.md)                         | Where the designs live, who can open them, and how a design becomes code.                     |
| [Dependency updates](dependency-updates.md) | How to add a dependency, and which updates Renovate merges without review.                    |
| [CI](ci.md)                                 | The workflows, the jobs of a pull request and of `main`, and the tags of the web image.       |
| [Deployments](deployments.md)               | The environments, how a deploy works, and how to roll an environment back.                    |
| [Privacy](privacy.md)                       | The personal data the site processes, where each retention is enforced, and the yearly check. |
| [Releasing](releasing.md)                   | How a maintainer releases a project, and how to recover when a step fails.                    |
| [Decisions](adr/README.md)                  | Why the workspace is built the way it is, one record per decision, and how to add one.        |

## Writing docs

These rules hold for every Markdown file in the repository: the guides, the project READMEs, and the community files. `pnpm moon run :lint-md` checks what [markdownlint](https://github.com/DavidAnson/markdownlint) can, with the rules in [`.markdownlint-cli2.yaml`](../.markdownlint-cli2.yaml), and review checks the rest.

### Style

- Write US English, as in "behavior" and "color".
- Leave out em dashes. Use the punctuation that fits the clause instead: a comma, parentheses, a colon, a semicolon, or a period.
- Write each paragraph and each list item on one line, and leave wrapping to the renderer.
- Pad every table by hand, alignment row included, so its columns line up in the source. Prettier formats no Markdown, and markdownlint fails on a table whose columns don't line up.

### Where a topic goes

Write each topic in one place, and link to it from the others:

| Topic                                                                      | Goes in                                                                           |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------------------|
| A guide that spans projects, such as setup, CI, or releasing               | A file in `docs/`, listed in the table above.                                     |
| Why the workspace is built a certain way                                   | A record in [`docs/adr/`](adr/README.md).                                         |
| The API, setup, and tasks of one project                                   | The README of that project.                                                       |
| How to take part: contributing, support, security, governance, and conduct | The community files at the root, such as [`CONTRIBUTING.md`](../CONTRIBUTING.md). |

### Project READMEs

A project README follows this outline, in this order, and leaves out a section with nothing to say:

1. An intro under the title, without a heading of its own, that says what the project is and names the files that configure its tools, such as `angular.json`.
2. **What belongs here:** the code that goes in the project, and where the code that doesn't goes instead.
3. **Using the package:** how another project adds and imports it.
4. A section per part of its API, named after that part, such as **Helpers** or **Entry points**.
5. **Testing:** the helpers and conventions of its tests.
6. **Tasks:** a table of its tasks with the columns Task, Command, Runs in CI, and Cached, then a paragraph and a command per task.
7. A section per tool the project runs, such as **Storybook**.

Open Tasks with a sentence that names `moon.yml` and each task the project inherits from `.moon/tasks/`, then say where to run the tasks:

```markdown
[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../.moon/tasks/eslint.yml). Run each task from the repository root.
```

`pnpm moon project <id>` lists every task of a project, inherited ones included.
