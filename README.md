# D&D Mapp

The monorepo for D&D Mapp: it holds all packages and applications of the project.

## Status

Early development: the repository holds the scaffold of the web client in [`apps/web`](apps/web/README.md) and its core in [`packages/core/web`](packages/core/web/README.md), and no features yet.

## Development

[moon](https://moonrepo.dev) runs the tasks of every project in the repository. It finds the projects in `apps/`, `packages/`, and `e2e/`, plus the `root` project for the checks that cover the whole repository. [`.moon/workspace.yml`](.moon/workspace.yml) configures the workspace, and each project's `moon.yml` defines its tasks. The tasks name their inputs through file groups: [`.moon/tasks/all.yml`](.moon/tasks/all.yml) defines the groups that every project shares, such as `configs`, and each project's `moon.yml` defines its own, such as `sources`. moon uses the Node.js and pnpm versions that `devEngines` in [`package.json`](package.json) pins. On Windows, install [PowerShell 7](https://learn.microsoft.com/powershell/scripting/install/install-powershell-on-windows), which moon runs the tasks in; without it, moon falls back to Windows PowerShell 5.1, which adds CLIXML progress records to the task output.

Generate the JSON schemas that the moon config files reference, so your editor can validate and complete them. moon writes them to `.moon/cache/schemas/` on its first run, and this command refreshes them:

```bash
pnpm moon sync
```

The unit tests and the end-to-end tests run in the Chromium build of the Playwright version in the `playwright` catalog. Playwright keeps its browsers in one cache per user, which every project shares, so install Chromium once and again after each Playwright update:

```bash
pnpm exec playwright install chromium
```

Format the repository with Prettier:

```bash
pnpm moon run root:format
```

Check the formatting without changing files:

```bash
pnpm moon run root:format-check
```

Lint the Markdown files with [markdownlint](https://github.com/DavidAnson/markdownlint-cli2). [`.markdownlint-cli2.yaml`](.markdownlint-cli2.yaml) holds the rules:

```bash
pnpm moon run root:lint-md
```

The web client's dev server serves the app over HTTPS at `https://localhost.www.dndmapp.dev:4200`, so `Secure` cookies, `SameSite`, and CORS work across sibling hosts as they do in production. The certificate also covers `https://localhost:4200` and `https://127.0.0.1:4200`, but those are separate sites, so cookies shared with sibling hosts work only on the `www` host. Set this up once per machine:

1. Install [mkcert](https://github.com/FiloSottile/mkcert#installation). Firefox also needs NSS `certutil`, which the mkcert install guide covers.
2. Create a local certificate authority and add it to the trust stores of your system and browsers:

    ```bash
    mkcert -install
    ```

3. Point the dev host at your machine. Add this line to your hosts file: `/etc/hosts` on macOS and Linux, or `C:\Windows\System32\drivers\etc\hosts` on Windows. Without it, only `localhost` and `127.0.0.1` reach the dev server, and the end-to-end tests cannot reach it:

    ```text
    127.0.0.1 localhost.www.dndmapp.dev
    ```

The first `web:start` runs `root:ssl-certs`, which has mkcert write a certificate and its key to `.ssl/`, and later runs restore them from the moon cache. moon keeps restoring that certificate after you install a new mkcert CA, or once the certificate expires after about two years. Regenerate it then:

```bash
pnpm moon run root:ssl-certs --force
```

Each project's README lists its tasks:

- [`apps/web`](apps/web/README.md): the Angular web client.
- [`e2e/web`](e2e/web/README.md): the end-to-end tests of the web client.
- [`packages/core/web`](packages/core/web/README.md): the core of the web client, which the domain modules build on.
- [`packages/config-typescript`](packages/config-typescript/README.md): the TypeScript config presets that the projects extend.
- [`packages/config-eslint`](packages/config-eslint/README.md): the shared ESLint config that enforces the dependency rules between the projects.

## Dependency updates

[Renovate](https://docs.renovatebot.com) opens a pull request as soon as an update is out, and [`.github/renovate.json`](.github/renovate.json) holds its config. npm packages first wait 3 days after their release, the same age pnpm requires before it installs them. The Dependency Dashboard issue lists every pending update.

Renovate merges these updates without review once the checks pass, since it may bypass the code owner review of the `Reviews` ruleset:

- Minor, patch, and digest updates of the development tools, the actions, the runners, and the Docker images in workflows.
- Lock file maintenance, which refreshes the transitive dependencies early on Monday mornings.

Every other update waits for a review: majors, Node.js and pnpm in `devEngines`, and dependencies outside the development tools. A new major of Node.js or pnpm first waits for approval on the Dependency Dashboard.

## Contributing

[`CONTRIBUTING.md`](CONTRIBUTING.md) explains where a contribution starts, the conventions for branches, commits, projects, and tasks, how to check your changes, and how a pull request gets reviewed and merged.

## License

D&D Mapp is released under the [MIT License](LICENSE).
