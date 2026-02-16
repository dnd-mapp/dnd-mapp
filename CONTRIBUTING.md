# Contributing to dnd-mapp

First off, thank you for your interest in contributing to D&D Mapp! As a proprietary project, we maintain high standards for code quality, architectural consistency, and environment parity.

Please follow these guidelines to ensure a smooth development process.

---

## 🛠 Development Environment

To ensure everyone is using the same versions of Node.js and pnpm, we use [mise-en-place](https://mise.jdx.dev/).

1. **Trust the Configuration**: After cloning, run:

   ```bash
   mise trust
   mise install
   ```
2. **Dependencies**: Always use `pnpm`. Do not use `npm` or `yarn` as they will generate incompatible lockfiles.

   ```bash
   pnpm install
   ```

---

## 🌿 Branching Strategy

We follow a feature-branch workflow:

- **main**: The stable, "deploy-ready" branch.
- **feature/description**: For new functionality (e.g., `feature/vtt-fog-of-war`).
- **bugfix/description**: For fixing issues (e.g., `bugfix/dice-roller-rounding`).
- **chore/description**: For maintenance tasks (e.g., `chore/update-angular-21`).

---

## 📝 Commit Message Convention

We enforce [Conventional Commits](https://www.conventionalcommits.org/) to automate changelogs and versioning. Your commit messages should follow this pattern:

`<type>[optional scope]: <description>`

**Common Types:**

- `feat`: A new feature for the user.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Formatting, missing semicolons, etc. (no functional code changes).
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `perf`: Code changes that improve performance.
- `test`: Adding or correcting tests.
- `chore`: Updating build tasks, package manager configs, etc.

*Example: `feat(vtt): add initiative tracker component`*

---

## 🎨 Coding Standards

### Linting & Formatting

Before submitting a Pull Request, ensure your code adheres to our ESLint and Prettier configurations:

```bash
# Check for linting errors
pnpm lint

# Automatically fix formatting issues
pnpm format:write
```

### Angular Best Practices

- **Strict Typing**: Always use TypeScript's strict mode. Avoid `any` whenever possible.
- **Component Structure**: Follow the established pattern of separating logic (.ts), template (.html), and styles (.scss/tailwind).
- **Signals**: Since we are on Angular 21, prefer **Signals** for reactive state management over traditional ChangeDetection/RxJS where appropriate.

---

## 🚀 Pull Request Process

1. **Update your branch**: Ensure your feature branch is rebased on the latest `main`.
2. **Verify the build**: Run `pnpm build` locally to ensure the Production AOT (Ahead-of-Time) compilation succeeds.
3. **Submit PR**: Create a Pull Request with a clear description of the changes and link any relevant issues.
4. **Review**: At least one code review is required before merging. Address any comments and push updates to the same branch.

---

## ⚖️ Legal Note

By contributing to **dnd-mapp**, you agree that your contributions will be licensed under the proprietary terms defined in the project's main LICENSE. All rights remain reserved by **NoNamer777**.
