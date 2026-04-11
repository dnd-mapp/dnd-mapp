# ⚔️ D&D Mapp | Core Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Angular](https://img.shields.io/badge/Angular-21.2.1-DD0031?style=flat&logo=angular)
![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18?style=flat&logo=vitest)
[![CI](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/push-main.yaml/badge.svg)](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/push-main.yaml)

The central hub for the **D&D Mapp** ecosystem. This repository contains the primary web-based game engine—a high-performance, containerized Angular platform designed to eliminate TTRPG friction through automated mechanical resolution, real-time tactical combat, and unified campaign management.

## 🛠️ Tech Stack & Features

- **Frontend:** Angular 21.2.1 (Signals & Reactive Architecture)
- **Styling:** Plain SCSS for a modular, framework-agnostic UI.
- **Testing:** Vitest with **Playwright Browser Mode** for high-fidelity unit testing.
- **Deployment:** Dockerized for consistent environments.
- **Package Manager:** `pnpm` with strict dependency and engine enforcement.
- **CI/CD:** GitHub Actions for automated linting, testing, and builds.

---

## 🚀 Getting Started

### Prerequisites

We use [mise-en-place (mise)](https://mise.jdx.dev/) to manage tool versions. See the [Mise Configuration Guide](https://github.com/dnd-mapp/.github/blob/main/docs/mise-configuration.md) for global setup instructions.

1. **Install required tools:**

   ```bash
   mise install
   ```

### 🔐 Local SSL & Domain Setup

To support the secure `https://localhost.www.dndmapp.dev:4200` environment, you must configure your local machine to resolve the custom hostname and trust a locally generated certificate.

1. Follow the [Local DNS Setup](https://github.com/dnd-mapp/.github/blob/main/docs/local-dns-setup.md) guide and add the following entry for this service:

   ```text
   127.0.0.1 localhost.www.dndmapp.dev
   ```

2. Follow the [Self-Signed Certificates](https://github.com/dnd-mapp/.github/blob/main/docs/self-signed-certificates.md) guide to install `mkcert` and set up the local CA, then generate the certificates for this service:

   ```bash
   pnpm gen:ssl-certs
   ```

### Development Server

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Install Playwright Browsers:**

   Since unit tests run in a real browser environment via Vitest, install the required binaries:

   ```bash
   pnpm test:install-browsers
   ```

3. **Start the local development server:**

   ```bash
   pnpm start
   ```

4. **Navigate to:** `https://localhost.www.dndmapp.dev:4200/`.

---

## 🧪 Quality Assurance & CI

We maintain high standards for code quality through automated pipelines.

### Continuous Integration

Every Pull Request and push to `main` triggers our GitHub Actions pipeline, which performs:

- **Formatting Validation:** Ensures code adheres to Prettier standards.
- **Linting:** Runs ESLint, Stylelint, and Markdownlint.
- **Type Checking & Compilation:** Verifies the Angular build.
- **Unit Testing:** Executes the Vitest suite in a headless Chromium environment.

### Local Testing

```bash
# Run tests in headless mode
pnpm test

# Run tests with the Vitest UI and Watch mode (Development)
pnpm test:development
```

- **Coverage:** We enforce an **80% coverage threshold**. Reports can be found in `coverage/dnd-mapp/` after running tests.

---

## 🎨 Code Style & Linting

We enforce consistent code quality and style using several automated tools. It is recommended to enable "Format on Save" in your IDE.

### VS Code

1. Install the [recommended extensions](./.vscode/extensions.json).
2. Enable **Editor: Format On Save**.
3. Set **Editor: Default Formatter** to `Prettier - Code formatter`.

### Manual Verification

You can run the following commands to check or fix the codebase manually:

| Tool             | Action        | Command                  |
|:-----------------|:--------------|:-------------------------|
| **Prettier**     | Format Check  | `pnpm format:check`      |
| **Prettier**     | Format Fix    | `pnpm format:write`      |
| **ESLint**       | TS/Logic Lint | `pnpm lint:eslint`       |
| **Stylelint**    | SCSS Lint     | `pnpm lint:stylelint`    |
| **Markdownlint** | Docs Lint     | `pnpm lint:markdownlint` |
| **All**          | Run All Lints | `pnpm lint`              |

---

## 🐳 Dockerization

The project is fully containerized using a multi-stage Docker build and Nginx for serving the production bundle. Configuration files are located in the `.docker/` directory.

### Build & Deployment

You can interact with the containerized environment using the following `pnpm` scripts:

| Method             | Command                    | Description                                         |
|:-------------------|:---------------------------|:----------------------------------------------------|
| **Standard Build** | `pnpm docker:build`        | Build the image using the local Dockerfile.         |
| **Docker Bake**    | `pnpm docker:bake`         | Multi-platform build (amd64/arm64) via Buildx Bake. |
| **Compose Up**     | `pnpm docker:compose:up`   | Spin up the stack in detached mode.                 |
| **Compose Down**   | `pnpm docker:compose:down` | Stop and remove the containers.                     |

### Manual Docker Commands

If you prefer using the CLI directly:

```bash
# Build using the specific Dockerfile location
docker build -f .docker/Dockerfile -t dndmapp/dnd-mapp:latest .

# Run the container locally on port 4200
docker run -p 4200:4200 dndmapp/dnd-mapp:latest
```

The containerized application listens on port `4200` as configured in `default.conf`.

---

## 🤝 Contributing

We follow a strict type-safe and reactive pattern. This project enforces `strictPeerDependencies` and `strictDepBuilds`. Please refer to the [Organization Contributing Guide](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md) before submitting a Pull Request.

---

**D&D Mapp Team** • *"Roll for initiative!"*
