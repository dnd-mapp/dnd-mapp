# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Enabled OnPush change detection for better performance and compatibility with zoneless operation.
- Added global layout styling to establish a consistent look and feel.
- Updated the page title to a more descriptive value.
- Included the Angular CDK package for UI utilities.
- Added a ComponentHarness and corresponding unit test for the RootComponent.

### Changed

- Generated the initial project scaffold and set up a pnpm workspace.
- Updated package version ranges and various configuration files (tsconfig, Prettier, ESLint, Stylelint, Markdownlint).
- Added Prettier plugin to organize imports and ran formatting across the codebase.
- Aligned editor configuration with Prettier and added instructions for using/configuring Prettier.
- Configured Mise tool management and added usage instructions.
- Added license, author, and package description fields; cleaned up .gitignore.
- Enabled analytics for Angular and updated build/dev commands.
- Removed default generated application, renamed and moved components, and reorganized app configuration and imports.
- Applied schematic defaults across the workspace and updated Angular project configuration.
- Added support for self-signed certificates, local domain configuration, and related README documentation.
- Installed and configured unit testing dependencies and vitest (with browser mode) along with test scripts and documentation.
- Added linting dependencies, scripts, and configuration for ESLint, Stylelint (including SVG parser), and Markdownlint.
- Removed default task and launch configurations; updated MCP configuration and recommended VS Code settings/extensions.
- Added CODEOWNERS file.
- Created CI pipelines for pushes, pull requests, and continuous delivery; extracted steps into composite actions; updated README with CI information and fixed badges.
- Reorganized run configurations.
- Added Docker containerization support: Dockerfiles, compose, bake files, build/run scripts, and documentation.
- Added continuous delivery job.
- Updated README files, including Docker Hub repository info and local LICENSE reference.
- Ignored additional folders for Stylelint and added a .gitattributes file.

### Deprecated

- (n/a)

### Removed

- (n/a)

### Fixed

- (n/a)

### Security

- (n/a)

---
