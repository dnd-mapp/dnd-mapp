# ⚔️ D&D Mapp | Core Web Application

![Docker Pulls](https://img.shields.io/docker/pulls/dndmapp/dnd-mapp)
![Docker Image Size](https://img.shields.io/docker/image-size/dndmapp/dnd-mapp/latest)
![Angular](https://img.shields.io/badge/Angular-21.2.1-DD0031?style=flat&logo=angular)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

The central hub for the **D&D Mapp** ecosystem. This image contains the primary web-based game engine—a high-performance, containerized Angular platform designed to eliminate TTRPG friction through automated mechanical resolution and real-time tactical combat.

This image is built using a multi-stage Docker process and served via **Nginx 1.29 (Alpine)** for maximum performance and security.

---

## 🚀 Quick Start

To run the latest version of the web application:

```bash
docker run -d --name dnd-mapp -p 4200:4200 dndmapp/dnd-mapp:latest
```

Once started, the application will be available at `http://localhost:4200`.

---

## 🛠️ Deployment

### Docker Compose

We recommend using Docker Compose for local orchestration:

```yaml
services:
    dnd-mapp:
        image: dndmapp/dnd-mapp:latest
        container_name: dnd-mapp
        restart: unless-stopped
        ports:
            - '4200:4200/tcp'
```

### Supported Platforms

This image is built as a multi-arch manifest supporting:

- `linux/amd64`
- `linux/arm64` (Compatible with Apple Silicon and Raspberry Pi)

---

## 📦 Image Details

- **Exposed Ports:** `4200`
- **Base Image:** `nginx:1.29.5-alpine3.23`
- **Configuration:** Custom Nginx configuration is located at `/etc/nginx/conf.d/default.conf` to handle Angular SPA routing (`try_files $uri $uri/ /index.html`).
- **Artifacts:** Includes **SBOM** (Software Bill of Materials) and **Provenance** attestations for supply chain security.

---

## 🏷️ Tagging Policy

- `latest`: Points to the most recent stable build from the `main` branch.
- `dev`: Points to the most recent successful CI build on pushes to the `main` branch.
- `sha-<commit-hash>`: Specific builds tied to GitHub commit history for reproducibility.

---

## 🔗 Project Links

- **Source Code:** [github.com/dnd-mapp/dnd-mapp](https://github.com/dnd-mapp/dnd-mapp)
- **Issue Tracker:** [Report Bugs](https://github.com/dnd-mapp/dnd-mapp/issues)
- **Organization:** [D&D Mapp on GitHub](https://github.com/dnd-mapp)

---

**D&D Mapp Team** • *"Roll for initiative!"*
