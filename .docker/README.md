# D&D Mapp: dnd-mapp

![Docker Pulls](https://img.shields.io/docker/pulls/dndmapp/dnd-mapp)
![Docker Image Size](https://img.shields.io/docker/image-size/dndmapp/dnd-mapp/latest)
![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)

The primary interface and gateway for the **D&D Mapp** platform. A comprehensive toolkit for Dungeons & Dragons 5e, bridging the gap between digital management and tabletop immersion for DMs and players.

## 🚀 Quick Start

To run the latest version of D&D Mapp immediately:

```bash
docker run -d -p 4200:4200 --name dnd-mapp dndmapp/dnd-mapp:latest
```

The application will be accessible at `http://localhost:4200`.

## 🛠 Deployment with Docker Compose

For a more stable setup, use the following `compose.yaml` file:

```yaml
services:
    dnd-mapp:
        image: dndmapp/dnd-mapp:latest
        container_name: dnd-mapp
        restart: unless-stopped
        ports:
            - '4200:4200/tcp'
```

Run it with:

```bash
docker compose up -d
```

## 📋 Features Included

- **Comprehensive SRD Lookup**: 5e spells, monsters, and mechanics.
- **Virtual Tabletop (VTT)**: Collaborative grid-based combat and fog of war.
- **Campaign Management**: Tools for journaling, world-building, and map distribution.
- **Character Sheets**: Full management for Player Characters.
- **Digital Dice Roller**: Integrated 5e rolling system.

## ⚙️ Configuration

### Multi-Platform Support

This image is built using Docker Buildx and supports the following architectures:

- `linux/amd64`
- `linux/arm64`
- `linux/arm/v7`

## 📄 License

**Proprietary.**
Copyright © 2026 NoNamer777. All rights reserved.

Use of this Docker image is governed by the proprietary license found in the project repository. Unauthorized redistribution, decompilation, or commercial use is strictly prohibited.

---

[GitHub Repository](https://github.com/dnd-mapp/dnd-mapp) | [Report Issues](https://github.com/dnd-mapp/dnd-mapp/issues)
