# Releasing

This guide walks a maintainer through releasing a project, from dispatching the bump to a published GitHub Release. A release takes three steps that only a maintainer can take: dispatch the bump, merge the release pull request, and push a signed tag. The [changelog entries](../CONTRIBUTING.md#changelog) of the project decide its version, and the [release CLI](../packages/release/README.md) runs every step that reads or writes the changelog.

The examples release `web` at `0.1.0`.

## Before you start

- You need the maintain or admin role on the repository, since the `Release tag creation` ruleset lets only those roles create `*@v*` tags.
- Your SSH signing key must be in [`.github/allowed_signers`](../.github/allowed_signers) on `main`, as [Adding a signer](#adding-a-signer) describes.
- git must sign tags with that key: set `gpg.format` to `ssh` and `user.signingkey` to the key.

## Dispatch the bump

Run the `Release pull request` workflow from the Actions tab, or with `gh`:

```bash
gh workflow run release-pull-request.yaml --field project=web --field level=auto
```

| Input      | Takes                                                                                                     |
|:-----------|:----------------------------------------------------------------------------------------------------------|
| `project`  | The moon id of the project to release.                                                                    |
| `level`    | `auto`, which picks the bump from the entries in `Unreleased`, or `major`, `minor`, or `patch` to set it. |
| `timezone` | The IANA time zone of the release date, `Europe/Amsterdam` by default.                                    |

The workflow lints every changelog, fails when `Unreleased` has no entries, and runs `release bump`. The `dnd-mapp` GitHub App commits the changed `CHANGELOG.md` and `package.json` to `chore/release-<project>`, which GitHub signs, and opens a pull request titled `chore: release <project> v<version>`. Its description says how the level was chosen.

Dispatching again rebuilds the branch from the latest `main` and updates the same pull request, so entries merged in the meantime join the release.

## Review and merge the release pull request

Check two things before you merge:

- **The version.** When `auto` picked the wrong level, dispatch again with an explicit one. When you set a level below the one `auto` picks, the description names what `auto` would pick.
- **The entries.** They become the body of the GitHub Release as they are. Fix an entry in a pull request to `main` and dispatch again, since a dispatch replaces the release branch.

The app pushed the release branch, so any member of [@dnd-mapp/reviewers](https://github.com/orgs/dnd-mapp/teams/reviewers) can approve it, you included. Auto-merge stays off, since merging is how a maintainer confirms the version. Merging publishes nothing yet: the release waits for the tag.

## Sign and push the tag

Tag the merge commit of the release pull request rather than the tip of `main`, since later commits may hold changes that the changelog doesn't list. The tag is named `<name>@v<version>`, with the `name` of the project's `package.json` without the scope. Run these commands from the root of the repository:

```bash
git switch main
git pull --ff-only
commit="$(gh pr view <number> --json mergeCommit --jq .mergeCommit.oid)"
git tag --sign web@v0.1.0 --message "Release web v0.1.0" "$commit"
```

Nobody can move or delete a pushed tag, so check the tag the way the release workflow will before you push it. `git cat-file` prints `tag` for an annotated tag, `git tag --verify` checks the signature against the allowed signers, and `git merge-base` succeeds when `main` reaches the tagged commit:

```bash
git cat-file -t web@v0.1.0
git -c gpg.ssh.allowedSignersFile=.github/allowed_signers tag --verify web@v0.1.0
git merge-base --is-ancestor web@v0.1.0 origin/main
```

Push the tag, which starts the `Release` workflow:

```bash
git push origin web@v0.1.0
```

## What the release workflow checks

The `Release` workflow runs four jobs, each after the one before it passes, so a failure publishes nothing that comes after it:

| Job                  | Checks or does                                                                                                                                                                                                             |
|:---------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Verify the tag`     | Fails unless the tag ends in a version such as `@v1.2.0`, names a project with a release image, is annotated, has a signature of a key in `.github/allowed_signers` on `main`, and points at a commit that `main` reaches. |
| `Verify the release` | Fails unless the `package.json` and the newest release in the changelog at the tag both hold the version, then extracts the release notes with `release notes`.                                                            |
| `Release image`      | Builds the image at the tag, and pushes it as `<version>`, `<major>.<minor>`, `<major>`, and `latest`. A version below `1.0.0` gets no `<major>` tag.                                                                      |
| `GitHub Release`     | Creates the Release `Release <project> v<version>` with the release notes, not marked as the latest, with a discussion in Announcements.                                                                                   |

Follow the run with `gh run watch`.

## Recovering

### From a failed bump

A failed bump publishes nothing. Fix the cause in a pull request to `main`, then dispatch again. The workflow fails when a changelog breaks Keep a Changelog, when `Unreleased` has no entries, or when the new version isn't above the highest tag of the project.

### From a wrong release pull request

Before it merges, dispatch again with another level or after fixing entries on `main`, or close the pull request to drop the release.

After it merges and before the tag, nothing has shipped. Revert the merge commit in a pull request to `main`, then dispatch again:

```bash
git revert -m 1 <merge-commit>
```

### From a failed release run

Fix the cause, then re-run the failed jobs. The jobs that passed keep their results, and the `GitHub Release` job leaves a Release that an earlier attempt created:

```bash
gh run rerun <run-id> --failed
```

A re-run fixes failures outside the tag, such as a Docker Hub outage, or a signing key that reached `.github/allowed_signers` on `main` after the tag was pushed.

### From a tag that can't pass

A tag that fails for its own content keeps failing on every re-run: a lightweight or unsigned tag, or one on a commit whose `package.json` and changelog hold another version. The tag can't be deleted, and `release bump` refuses any version that isn't above the highest tag, so its version is taken.

Ship the release under the next patch version instead. In a pull request to `main`, rename the unpublished section of the changelog to that version, fix its compare links, and set the version in `package.json`. `pnpm moon run web:lint-changelog` points out each link that is still wrong. Then tag the merge commit of that pull request.

### From a wrong release

A published release stays: its tag, its image tags, and its Release. Supersede it with the next version, which also moves `latest`:

1. Fix the problem in a pull request to `main`, with a changelog entry for the fix.
2. In the same or another pull request, mark the wrong release as pulled by adding `[YANKED]` after its date, as in `## [0.1.0] - 2026-11-10 [YANKED]`.
3. Release the next version from the steps above.

## Adding a releasable project

The release workflow finds a project from its tag, so the moon id of the project must match the `name` in its `package.json` without the scope. Then:

1. Give its `package.json` a `version` of `0.0.0` and a `repository` field, as [`apps/web/package.json`](../apps/web/package.json) has, and add `@dnd-mapp/release` to its `devDependencies`.
2. Add a `CHANGELOG.md` in the format of [`apps/web/CHANGELOG.md`](../apps/web/CHANGELOG.md), with entries under `Unreleased` for what the project does today. The project then inherits the `lint-changelog` task.
3. Add the moon id to the `project` options of [`release-pull-request.yaml`](../.github/workflows/release-pull-request.yaml).
4. Add a case for the project to the `Verify the tag` step of [`release.yaml`](../.github/workflows/release.yaml), with its Docker Hub image and bake target. The workflow publishes an image for every project, so a project that ships something else needs a change to the workflow.

## Adding a signer

Add the public SSH signing key of the maintainer to [`.github/allowed_signers`](../.github/allowed_signers) in a pull request, as one line in the format of the existing one: an email, `namespaces="git"`, and the key. The release workflow reads the file from `main`, so the key can sign release tags once the pull request merges. Removing a line stops its key from releasing, even on an older commit.

The signer also needs the maintain or admin role on the repository, which the [lead maintainer](../GOVERNANCE.md#lead-maintainer) grants.
