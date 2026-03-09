# ⚔️ D&D Mapp | Core Web Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Angular](https://img.shields.io/badge/Angular-21.2.1-DD0031?style=flat&logo=angular)
![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18?style=flat&logo=vitest)

The central hub for the **D&D Mapp** ecosystem. This repository contains the primary web-based game engine—a high-performance, containerized Angular platform designed to eliminate TTRPG friction through automated mechanical resolution, real-time tactical combat, and unified campaign management.

## 🛠️ Tech Stack & Features

- **Frontend:** Angular 21.2.1 (Signals & Reactive Architecture)
- **Styling:** Plain SCSS for a modular, framework-agnostic UI.
- **Testing:** Vitest with **Playwright Browser Mode** for high-fidelity unit testing.
- **Deployment:** Dockerized for consistent environments.
- **Package Manager:** `pnpm` with strict dependency and engine enforcement.

---

## 🚀 Getting Started

### Prerequisites

We use [mise-en-place (mise)](https://mise.jdx.dev/) to manage tool versions defined in `.tool-versions`.

1. **Install Mise** (if not already installed).
2. **Install [mkcert](https://github.com/FiloSottile/mkcert):**

    - **macOS:** `brew install mkcert`
    - **Linux:** `sudo apt install mkcert`
    - **Windows:** `choco install mkcert` or `scoop install mkcert`

3. **Install required tools:**

   ```bash
   mise install
   ```

### 🔐 Local SSL & Domain Setup

To support the secure `https://localhost.www.dndmapp.dev:4200` environment, you must configure your local machine to trust a self-signed certificate and map the domain.

#### 1. Generate Certificates

Run the following commands in the project root to generate the certificates required by `angular.json`:

```bash
# Initialize mkcert on your machine (one-time setup)
mkcert -install

# Generate certificates for the local domain
pnpm gen:ssl-certs
```

#### 2. Update Hosts File

Add `127.0.0.1 localhost.www.dndmapp.dev` to your system's hosts file to map the custom domain to your local machine.

##### **macOS / Linux**

Run the following command:

```bash
echo "127.0.0.1 localhost.www.dndmapp.dev" | sudo tee -a /etc/hosts
```

##### **Windows**

1. Open **Notepad** as an Administrator.
2. Open `C:\Windows\System32\drivers\etc\hosts`.
3. Add the following line to the bottom:

   ```text
   127.0.0.1 localhost.www.dndmapp.dev
   ```

4. Save the file.

#### 3. Trusting the CA (Verification)

The `mkcert -install` command usually handles the OS trust store automatically.

- **Linux:** If using Firefox, you may need to manually import the root CA found at `mkcert -CAROOT` into the browser's Certificate Manager.
- **Windows/Mac:** Restart your browser after running the install command to ensure the new CA is recognized.

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

## 🎨 Code Style & Linting

We enforce consistent code quality and style using several automated tools. It is recommended to enable "Format on Save" in your IDE.

### VS Code

1. Install the [recommended extensions](./.vscode/extensions.json).
2. Open `Settings` <kbd>Ctrl</kbd>+<kbd>,</kbd>.
3. Search for `Editor: Format On Save` and enable it.
4. Ensure `Editor: Default Formatter` is set to `Prettier - Code formatter`.

### WebStorm

1. Go to `Settings` > `Languages & Frameworks`.
2. **Prettier:** Ensure the package points to `node_modules/prettier` and check **On save**.
3. **Stylelint:** Enable it under `Stylelint` and ensure the configuration file is detected.
4. **Markdown:** Markdownlint support is typically integrated or available via the "Markdownlint" plugin.

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

## 🧪 Quality Assurance

We use **Vitest** for a modern testing experience. Tests run in a **Chromium** instance via Playwright to ensure component behavior is verified against a real DOM.

### Unit Tests

```bash
# Run tests in headless mode (CI)
pnpm test

# Run tests with the Vitest UI and Watch mode (Development)
pnpm test:development
```

- **Configuration:** Managed in `vitest.config.mts`.
- **Coverage:** Enforced at 80% across branches, functions, lines, and statements. Reports are generated in `reports/dnd-mapp/`.

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
