import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { type Files, mockFileSystem } from '@dnd-mapp/testing/file-system';
import { run } from '../cli.ts';

/** The files, tags, and clock of a fixture. Each option has a default, so a test sets only those it depends on. */
export interface FixtureOptions {
    /**
     * How the repository holds the project: as the package `@dnd-mapp/<project>` in `apps/<project>` of a pnpm
     * workspace, or as the only package, at the root.
     */
    layout?: 'workspace' | 'single';
    /** The unscoped name of the package of the project. */
    project?: string;
    /** The content of `CHANGELOG.md`, or `undefined` to leave the file out. */
    changelog?: string | undefined;
    /** The content of `package.json`. Defaults to a manifest that holds `version` and the repository of D&D Mapp. */
    manifest?: string;
    /** The version in the default `package.json`. */
    version?: string;
    /** More files of the repository, by their path relative to its root. */
    files?: Files;
    /** The tags of the repository. */
    tags?: string[];
    /** The current time, as an ISO 8601 string. */
    now?: string;
    /** The time zone of the machine. */
    timeZone?: string;
}

/** What a run of the CLI returned and printed. */
export interface RunResult {
    /** The exit code. */
    code: number;
    /** Everything the CLI wrote to standard output. */
    stdout: string;
    /** Everything the CLI wrote to standard error. */
    stderr: string;
}

/** A project in the mocked file system, and the CLI to run against it. */
export interface Fixture {
    /** The folder of the project. */
    root: string;
    /** The working directory of the CLI, which holds the repository. */
    cwd: string;
    /** Runs the CLI with the given arguments after the executable. */
    run(...argv: string[]): Promise<RunResult>;
    /** Reads a file of the repository, by its path relative to the working directory. */
    read(file: string): Promise<string>;
}

/** The working directory of the CLI and the root of the repository, at the root of the drive. */
const cwd = resolve('/repo');

/** The `repository` field of the packages of D&D Mapp. */
export const repositoryField = { type: 'git', url: 'git+https://github.com/dnd-mapp/dnd-mapp.git' };

/**
 * Sets up a repository with a project in the mocked file system, with fakes for git and the clock. Load the mock in the
 * test file first, with `await vi.hoisted(() => import('@dnd-mapp/testing/file-system'))`. Without it, the modules that
 * import `node:fs` before the mock loads keep the real one, so the test reads from `/repo` on the real disk and fails.
 */
export function createFixture(options: FixtureOptions = {}): Fixture {
    const project = options.project ?? 'web';
    const single = options.layout === 'single';
    const root = single ? cwd : join(cwd, 'apps', project);
    const name = single ? project : `@dnd-mapp/${project}`;
    const manifest =
        options.manifest ??
        `${JSON.stringify({ name, version: options.version ?? '0.0.0', repository: repositoryField }, null, 2)}\n`;
    const workspace = single
        ? {}
        : {
              [join(cwd, 'package.json')]: '{\n  "name": "dnd-mapp",\n  "private": true\n}\n',
              [join(cwd, 'pnpm-workspace.yaml')]: 'packages:\n  - apps/*\n',
          };
    const files: Files = Object.fromEntries(
        Object.entries(options.files ?? {}).map(([path, content]) => [join(cwd, path), content]),
    );

    mockFileSystem({
        ...workspace,
        ...files,
        [join(root, 'package.json')]: manifest,
        ...(options.changelog !== undefined && { [join(root, 'CHANGELOG.md')]: options.changelog }),
    });
    return {
        root,
        cwd,
        async run(...argv) {
            let stdout = '';
            let stderr = '';

            const code = await run(argv, {
                cwd,
                listTags: (prefix) => Promise.resolve((options.tags ?? []).filter((tag) => tag.startsWith(prefix))),
                clock: {
                    now: () => new Date(options.now ?? '2026-11-06T12:00:00Z'),
                    timeZone: () => options.timeZone ?? 'UTC',
                },
                stdout: (text) => (stdout += text),
                stderr: (text) => (stderr += text),
            });
            return { code, stdout, stderr };
        },
        read: (file) => readFile(join(cwd, file), 'utf8'),
    };
}
