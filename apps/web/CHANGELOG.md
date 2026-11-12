# Changelog

All notable changes to the web app are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A description and a preview image for links to the app, and the D&D Mapp logo as its favicon and home screen icon.

### Changed

- The page uses the colors of the D&D Mapp design system: a dark blue-gray background instead of a neutral gray one, and a matching off-white text color.

## [0.1.0] - 2026-11-10

### Added

- A placeholder page titled D&D Mapp, in a dark theme.
- The `dndmapp/web` Docker image, which serves the app with nginx on port 4200.
- The `BASE_HREF` build argument of the image, which serves the app under a base path, such as `/pr-42/`.
- `build-info.json`, which reports the commit and version of the build that a deployment serves.
- A `/healthz` endpoint and a `HEALTHCHECK` in the image, which report whether the container is healthy.

[unreleased]: https://github.com/dnd-mapp/dnd-mapp/compare/web@v0.1.0...HEAD
[0.1.0]: https://github.com/dnd-mapp/dnd-mapp/releases/tag/web@v0.1.0
