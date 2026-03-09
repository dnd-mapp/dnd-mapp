# Release and Versioning Policy

This project follows a strict state-machine approach to Semantic Versioning (SemVer). All version updates are automated via GitHub Actions and must adhere to the following transition rules.

## 1. Allowed Version Inputs

Developers must choose one of the following increment types for the `version` input:

- `major`, `minor`, `patch`
- `premajor`, `preminor`, `prepatch`
- `prerelease`

Manual version strings are strictly prohibited.

## 2. Prerelease Identifier (prerelease-id)

The `prerelease-id` input is restricted to the following values:

- `alpha`
- `beta`
- `rc` (Release Candidate)
- `none` (Used for validation or promotion to stable; never literal)

## 3. Core Transition Rules

### A. Initializing Prereleases

1. If the current version **IS NOT** a prerelease and `version` is `prepatch`, `preminor`, or `premajor`, then `prerelease-id` **MUST NOT** be `none`.
2. If the current version **IS NOT** a prerelease, then `version` **MUST NOT** be `prerelease`.

### B. Prerelease Maintenance

3. If the current version **IS** a prerelease and `version` is `prerelease`, the `prerelease-id` may be excluded (defaults to current ID) or updated according to the Identifier Progression rules.

### C. Release Track Lock-in

To ensure a release track is completed before moving to the next:
4. **Premajor Track:** If the current version is `premajor`, the next `version` **MUST** be `prerelease` OR `major`.
5. **Preminor Track:** If the current version is `preminor`, the next `version` **MUST** be `prerelease`, `minor`, or escalated to `premajor`.
6. **Prepatch Track:** If the current version is `prepatch`, the next `version` **MUST** be `prerelease`, `patch`, or escalated to `preminor`/`premajor`.

*Note: Escalating a release track (e.g., `preminor` -> `premajor`) allows resetting the `prerelease-id` to a lower weight (e.g., back to `alpha`).*

## 4. Identifier Progression (The "Forward-Only" Rule)

When the `version` input is `prerelease` within the same release track, the `prerelease-id` can only move forward in the following hierarchy:
`alpha` -> `beta` -> `rc` -> `none` (Stable)

7. **From Alpha:** If current ID is `alpha`, the next ID **MUST** be `none`, `alpha`, `beta`, or `rc`.
8. **From Beta:** If current ID is `beta`, the next ID **MUST** be `none`, `beta`, or `rc`.
9. **From RC:** If current ID is `rc`, the next ID **MUST** be `none` or `rc`.

## 5. Metadata and Formatting

- **Build Metadata:** Build metadata (e.g., `+sha.123`) is intentionally excluded and will not be used in version strings.
- **Automation:** The `none` identifier is a functional placeholder for the CI/CD pipeline. When `none` is selected for a stable transition, the `--preid` flag is omitted from the `pnpm version` command.
