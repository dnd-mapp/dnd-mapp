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
- **Capabilities:** Real-time WebSocket synchronization, dynamic tactical maps, and automated 5e rule resolution.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Angular CLI](https://github.com/angular/angular-cli) (`pnpm install -g @angular/cli`)
- [Docker](https://www.docker.com/) (For containerized deployment)

### Development Server

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the local development server:

   ```bash
   pnpm start
   ```

3. Navigate to `http://localhost:4200/`. The application will automatically reload on source changes.

### Production Build

To compile the project and optimize for performance:

```bash
pnpm build
```

Build artifacts will be stored in the `dist/dnd-mapp` directory.

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

*Note: Ensure your preferred E2E driver is configured in the environment.*

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

We follow a strict type-safe and reactive pattern. Please refer to the [Organization Contributing Guide](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md) before submitting a Pull Request.

**D&D Mapp Team** • *"Roll for initiative!"*
