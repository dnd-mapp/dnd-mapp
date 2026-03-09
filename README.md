# ⚔️ D&D Mapp | Core Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Angular](https://img.shields.io/badge/Angular-21.2.1-DD0031?style=flat&logo=angular)
![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18?style=flat&logo=vitest)

The central hub for the **D&D Mapp** ecosystem. This repository contains the primary web-based game engine—a high-performance, containerized Angular platform designed to eliminate TTRPG friction through automated mechanical resolution, real-time tactical combat, and unified campaign management.

## 🛠️ Tech Stack & Features

- **Frontend:** Angular 21.2.1 (Signals & Reactive Architecture)
- **Styling:** Plain SCSS for a modular, framework-agnostic UI.
- **Testing:** Vitest for lightning-fast unit testing.
- **Deployment:** Dockerized for consistent environments.
- **Package Manager:** `pnpm` with strict dependency and engine enforcement.

---

## 🚀 Getting Started

### Prerequisites

We use [mise-en-place (mise)](https://mise.jdx.dev/) to manage tool versions defined in `.tool-versions`.

1. **Install Mise** (if not already installed).
2. **Install required tools:**

   ```bash
   mise install
   ```

   *This will automatically set up Node.js `24.14.0` and pnpm `10.31.0` as per project requirements.*

### Development Server

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

   > [!NOTE]
   > `engineStrict` and `packageManagerStrictVersion` are enabled to ensure environment parity.

2. **Start the local development server:**

   ```bash
   pnpm start
   ```

3. **Navigate to:** `http://localhost:4200/`. The application will automatically reload on source changes.

---

## 🎨 Code Style & Linting

We use **Prettier** to maintain a consistent code style. It is recommended to enable "Format on Save" in your IDE.

### VS Code

1. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
2. Open `Settings` <kbd>Ctrl</kbd>+<kbd>,</kbd>.
3. Search for `Editor: Format On Save` and enable it.
4. Ensure `Editor: Default Formatter` is set to `Prettier - Code formatter`.

### WebStorm

1. Go to `Settings` > `Languages & Frameworks` > `Prettier`.
2. Ensure the `Prettier package` points to the project's `node_modules/prettier`.
3. Check the **On save** checkbox.
4. (Optional) Check **Run on reformat code action** to replace the default IDE formatter.

### Manual Formatting

```bash
# Check formatting
pnpm format:check

# Fix formatting
pnpm format:write
```

---

## 🧪 Quality Assurance

### Unit Tests

We use **Vitest** for a modern, high-speed testing experience:

```bash
pnpm test
```

### End-to-End (E2E)

```bash
pnpm e2e
```

### Scaffolding

Generate new components, services, or signals using the CLI:

```bash
ng generate component feature/map-renderer
```

---

## 🐳 Dockerization

To build and run the application as a container:

```bash
docker build -t dndmapp/dnd-mapp .
docker run -p 4200:4200 dndmapp/dnd-mapp
```

---

## 🤝 Contributing

We follow a strict type-safe and reactive pattern. This project enforces `strictPeerDependencies` and `strictDepBuilds`. Please refer to the [Organization Contributing Guide](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md) before submitting a Pull Request.

**D&D Mapp Team** • *"Roll for initiative!"*
