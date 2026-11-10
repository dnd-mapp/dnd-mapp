# Development

This guide sets up a machine to work on D&D Mapp, from the tools to install to a running dev server, and covers the tasks, git hooks, and editor settings that every project shares. Each project's README lists its own tasks, as the [Projects](../README.md#projects) section of the README links them.

## Prerequisites

| Tool                                                                                                                | Needed for                                                                         |
|:--------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------|
| [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io), at the versions that `devEngines` in `package.json` pins | Everything. pnpm refuses to run on any other version.                              |
| [PowerShell 7](https://learn.microsoft.com/powershell/scripting/install/install-powershell-on-windows), on Windows  | Every task, as [Tasks](#tasks) explains.                                           |
| [mkcert](https://github.com/FiloSottile/mkcert#installation)                                                        | The dev server, as [HTTPS for the dev server](#https-for-the-dev-server) explains. |
| [Docker](https://docs.docker.com/get-started/get-docker/)                                                           | Building the web image, and the end-to-end tests with the CI settings.             |
| [actionlint](https://github.com/rhysd/actionlint) and [ShellCheck](https://github.com/koalaman/shellcheck)          | Linting the GitHub Actions workflows.                                              |

[mise](https://mise.jdx.dev) can install Node.js and pnpm at the pinned versions, once it reads them from `package.json`. Turn that on, then install them from the root of the repository:

```bash
mise settings add idiomatic_version_file_enable_tools node
mise settings add idiomatic_version_file_enable_tools pnpm
mise install
```

## First run

1. Clone the repository, and install its dependencies. `pnpm install` also installs the [git hooks](#git-hooks):

    ```bash
    pnpm install
    ```

2. Install the Chromium build that the unit tests and the end-to-end tests run in, as [Browsers](#browsers) explains:

    ```bash
    pnpm exec playwright install chromium
    ```

3. Set up [HTTPS for the dev server](#https-for-the-dev-server).
4. Serve the web client at <https://localhost.www.dndmapp.dev:4200>:

    ```bash
    pnpm moon run web:start
    ```

## Tasks

[moon](https://moonrepo.dev) runs the tasks of every project in the repository. It finds the projects in `apps/`, `packages/`, and `e2e/`, plus the `root` project for the checks that cover the whole repository. [`.moon/workspace.yml`](../.moon/workspace.yml) configures the workspace, and each project's `moon.yml` defines its tasks. moon uses the Node.js and pnpm on `PATH`, which `devEngines` in [`package.json`](../package.json) pins. [Architecture](architecture.md#tasks-and-file-groups) explains how the tasks are defined.

On Windows, moon runs the tasks in PowerShell 7. Without it, moon falls back to Windows PowerShell 5.1, which adds CLIXML progress records to the task output.

Generate the JSON schemas that the moon config files reference, so your editor can validate and complete them. moon writes them to `.moon/cache/schemas/` on its first run, and this command refreshes them:

```bash
pnpm moon sync
```

The `root` project formats and lints the whole repository. Format it with Prettier:

```bash
pnpm moon run root:format
```

Check the formatting without changing files:

```bash
pnpm moon run root:format-check
```

Lint the Markdown files with [markdownlint](https://github.com/DavidAnson/markdownlint-cli2). [`.markdownlint-cli2.yaml`](../.markdownlint-cli2.yaml) holds the rules:

```bash
pnpm moon run root:lint-md
```

## Browsers

The unit tests and the end-to-end tests run in the Chromium build of the Playwright version in the `playwright` catalog. Playwright keeps its browsers in one cache per user, which every project shares, so install Chromium once and again after each Playwright update:

```bash
pnpm exec playwright install chromium
```

## HTTPS for the dev server

The web client's dev server serves the app over HTTPS at `https://localhost.www.dndmapp.dev:4200`, so `Secure` cookies, `SameSite`, and CORS work across sibling hosts as they do in production. The certificate also covers `https://localhost:4200` and `https://127.0.0.1:4200`. Those reach the same server but are separate sites, so cookies shared with sibling hosts work only on the `www` host. Set this up once per machine:

1. Install [mkcert](https://github.com/FiloSottile/mkcert#installation). Firefox also needs NSS `certutil`, which the mkcert install guide covers.
2. Create a local certificate authority and add it to the trust stores of your system and browsers:

    ```bash
    mkcert -install
    ```

3. Point the dev host at your machine. Add this line to your hosts file: `/etc/hosts` on macOS and Linux, or `C:\Windows\System32\drivers\etc\hosts` on Windows. Without it, only `localhost` and `127.0.0.1` reach the dev server:

    ```text
    127.0.0.1 localhost.www.dndmapp.dev
    ```

The first `web:start` runs `root:ssl-certs`, which has mkcert write a certificate and its key to `.ssl/`, and later runs restore them from the moon cache. moon keeps restoring that certificate after you install a new mkcert CA, or once the certificate expires after about two years. Regenerate it then:

```bash
pnpm moon run root:ssl-certs --force
```

## Git hooks

`pnpm install` installs git hooks with [lefthook](https://lefthook.dev), so formatting, Markdown, and commit message problems surface before CI runs. [`lefthook.yaml`](../lefthook.yaml) defines them:

- `pre-commit` formats the staged files with Prettier and fixes the staged Markdown files with markdownlint, then adds the fixes to the commit. The commit stops when markdownlint finds a problem it cannot fix.
- `commit-msg` lints the commit message with commitlint.

Set `LEFTHOOK=0` to skip the hooks for one command:

```bash
LEFTHOOK=0 git commit
```

## Editors

The repository holds settings for two editors, so either runs the tasks without setup of its own:

- **VS Code.** [`.vscode/extensions.json`](../.vscode/extensions.json) recommends the extensions for the languages and tools of the repository, such as ESLint, Prettier, markdownlint, moon, mise, Playwright, and Vitest. [`.vscode/settings.json`](../.vscode/settings.json) formats on save with Prettier. [`.vscode/tasks.json`](../.vscode/tasks.json) runs the common moon tasks, and the `Debug web` launch configuration in [`.vscode/launch.json`](../.vscode/launch.json) starts the dev server and opens the app in Chrome with the debugger attached.
- **WebStorm and IntelliJ IDEA.** [`.idea/runConfigurations/`](../.idea/runConfigurations) holds a run configuration for each common moon task, named after it, such as `web:start`.
