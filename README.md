# D&D Mapp: dnd-mapp

![CI Status](https://github.com/dnd-mapp/dnd-mapp/actions/workflows/push-main.yml/badge.svg)
![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)

The primary interface and gateway for the D&D Mapp platform. Designed specifically for Dungeons & Dragons Fifth Edition, dnd-mapp is a comprehensive toolkit that bridges the gap between digital management and tabletop immersion, providing a seamless experience for both Dungeon Masters and players.

## Features

### For Everyone

- **Comprehensive SRD Lookup**: Instant access to 5e spells, monster and NPC statistics, and core game mechanics.
- **Character Management**: Create, customize, and manage detailed Player Characters.
- **Digital Dice Roller**: Integrated rolling system for quick and accurate calculations.

### For Players

- **Campaign Collaboration**: Join and participate in campaigns managed by your DM.
- **Session Journaling**: Create and organize private or shared session notes to track your party's progress.

### For Dungeon Masters

- **Campaign Orchestration**: Create and manage complex campaigns with ease.
- **World Building**: Draft and share world lore, handouts, and custom monster stat blocks.
- **Cartography Hub**: Create and distribute world, village, or tactical battle maps.

### Virtual Tabletop (VTT)

- **Combat Simulation**: A collaborative virtual tabletop where Players and DMs can visualize and resolve encounters in real-time.
- **Interactive Maps**: Grid-based movement and dynamic fog of war for immersive exploration.

---

## Getting Started

### Prerequisites

This project uses [mise-en-place](https://mise.jdx.dev/) to manage runtime versions and ensure environment consistency across development and CI/CD.

1. Install Mise to automatically manage:

    - **Node.js**: v24.13.1
    - **pnpm**: v10.29.3

2. **mkcert**: Required for local HTTPS. [Install mkcert](https://github.com/FiloSottile/mkcert#installation).

### Local Environment Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/dnd-mapp/dnd-mapp.git
    cd dnd-mapp
    ```

2.  **Install toolchains and dependencies**:

    ```bash
    mise install
    pnpm install
    ```

3.  **Configure Local DNS**:

    Add the following entry to your `/etc/hosts` (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows) file:

    ```text
    127.0.0.1  localhost.www.dndmapp.dev
    ```

4.  **Generate SSL Certificates**:

    Generate certificates using `mkcert`:

    ```bash
    mkcert -install
    mkcert -key-file ssl-key.pem -cert-file ssl-cert.pem localhost.www.dndmapp.dev localhost 127.0.0.1
    ```

## Docker & Containerization

The application is containerized using Docker for consistent deployment across different architectures (`amd64`, `arm64`, `arm/v7`).

### Using Docker Compose

To spin up the application quickly using the pre-built image:

```bash
docker compose -f .docker/compose.yaml up -d
```

The application will be accessible at `http://localhost:4200`.

> [!IMPORTANT]
> **HTTPS Support**: The default Docker configuration does not support HTTPS out of the box. While the local development server (`pnpm start`) uses `mkcert` for secure communication, the Docker container serves the application over standard HTTP via Nginx. If you require HTTPS within a containerized environment, you must manually mount your SSL certificates into the Nginx container and update the server configuration.

### Building with Docker Buildx Bake

We use Docker Bake for high-performance, multi-platform builds. To build the image locally:

```bash
docker buildx bake -f .docker/docker-bake.hcl app
```

This will trigger a multi-stage build (using Node 24 and Nginx 1.29) and generate SBOM and provenance attestations.

---

## Development Server

Run the following command to start the local development server with HTTPS:

```bash
pnpm start
```

Navigate to `https://localhost.www.dndmapp.dev:4200/`. The application will automatically reload if you change any source files.

> [!TIP]
> **Troubleshooting Connection Errors**: If you encounter "Privacy/SSL" errors or "Address Not Found" in your browser:
> 1. Ensure you have followed the **Local Environment Setup** steps to add `127.0.0.1 localhost.www.dndmapp.dev` to your system's `hosts` file.
> 2. Verify that you have run `mkcert -install` and generated the `.pem` files in the root directory.
> 3. If the browser still blocks the connection, try restarting the browser or clearing the HSTS cache for `localhost.www.dndmapp.dev`.

---

## Code Quality & Editor Setup

We use **ESLint** for static analysis and **Prettier** to maintain a consistent code style.

### Visual Studio Code

We provide a list of recommended extensions in `.vscode/extensions.json`. When you open the project in VS Code, you will be prompted to install them.

To automate linting and formatting on save, ensure your `.vscode/settings.json` includes:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm

#### ESLint

1. Open **Settings**.
2. Navigate to **Languages & Frameworks** > **JavaScript** > **Code Quality Tools** > **ESLint**.
3. Select **Automatic ESLint configuration**.
4. Check **Run eslint --fix on save**.

#### Prettier

1. Open **Settings**.
2. Navigate to **Languages & Frameworks** > **JavaScript** > **Prettier**.
3. Select **Automatic Prettier configuration**.
4. Check **Run on save**.
5. Ensure the "Prettier package" points to the project's `node_modules/prettier`.

---

## Scripts

- **Start**: `pnpm start` - Runs the dev server.
- **Build**: `pnpm build` - Compiles the application into the `dist/dnd-mapp/browser` directory.
- **Lint**: `pnpm lint` - Runs ESLint to check for code quality issues.
- **Format**: `pnpm format:write` - Manually format all files using Prettier.

## Tech Stack

- **Framework**: Angular 21
- **Package Manager**: pnpm
- **Environment Manager**: mise-en-place
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Local HTTPS**: mkcert
- **Containerization**: Docker & Nginx

## Project Structure

The project follows a modular Angular architecture, optimized for Tailwind CSS v4 and clear separation of concerns.

```text
dnd-mapp/
├── .docker/                            # Docker configuration, Compose files, and Bake HCL
├── .vscode/                            # Visual Studio Code settings and recommendations
├── public/                             # Static assets (images, icons, etc.)
├── src/
│   ├── app/
│   │   ├── core/                       # Singleton services, guards, and base components
│   │   │   ├── config/                 
│   │   │   │   └── app.config.ts       # Application-wide providers and configuration
│   │   │   └── root/                   # The main application entry component
│   │   │       └── root.component.ts   
│   │   ├── features/                   # Functional modules (Campaigns, VTT, SRD, etc.)
│   │   └── shared/                     # Reusable components, pipes, and directives
│   ├── index.html                      # Application host page
│   ├── main.ts                         # Bootstrapping logic
│   └── styles.css                      # Tailwind v4 entry point with @theme imports
├── .tool-versions                      # Version management for Node.js and pnpm (Mise)
├── package.json                        # Project dependencies and scripts
├── pnpm-lock.yaml                      # Locked dependency versions
└── tsconfig.json                       # TypeScript configuration
```

### Key Architectural Notes:

- **Root Component**: Following a clean-core pattern, the main entry point has been renamed to `root.component.ts` and resides in `src/app/core/root/`.
- **Tailwind CSS v4**: This project uses the CSS-first configuration approach of Tailwind v4. Theme variables and customizations are defined directly in `src/styles.css` using the `@theme` block, eliminating the need for a separate `tailwind.config.js`.
- **Environment Management**: We use `.tool-versions` to ensure that `mise` loads the exact versions of Node.js and pnpm required for this project.

## Deployment

To prepare the application for a production environment, you must generate a production build. This process optimizes the bundle size and minifies the code for better performance.

### Building for Production

Run the following command to create a production-ready build:

```bash
pnpm build
```

### Build Output

Once the build process is complete, the compiled files will be located in the following directory:

```text
dist/dnd-mapp/browser
```

These files are static and can be deployed to any web server (e.g., Nginx, Apache, or cloud hosting services like Vercel, Netlify, or AWS S3).

**Note**: Ensure your web server is configured to redirect all requests to `index.html` to support Angular's client-side routing.

## License

Copyright © 2026 NoNamer777. All rights reserved.

This software and its associated documentation are proprietary. Access to and use of this software is strictly governed by the terms of the [LICENSE](LICENSE) file included in this repository.

No part of this project may be reproduced, distributed, or transmitted in any form or by any means, including copying or creating derivative works, without the prior written permission of the author.

For inquiries regarding licensing or permissions, please contact the author via the GitHub repository.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct, branching strategy, and the process for submitting pull requests.

As this project is proprietary, please ensure you have received authorization before contributing.
