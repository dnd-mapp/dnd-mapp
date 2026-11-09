import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { mockFileSystem } from '@dnd-mapp/testing/file-system';
import { run } from '../cli.ts';

export interface FixtureOptions {
    /** The moon id of the project. */
    project?: string;
    /** The content of `CHANGELOG.md`, or `undefined` to leave the file out. */
    changelog?: string | undefined;
    /** The content of `package.json`. Defaults to a manifest that holds `version`. */
    manifest?: string;
    /** The version in the default `package.json`. */
    version?: string;
    /** The tags that git lists for the project. */
    tags?: string[];
    /** The current time, as an ISO 8601 string. */
    now?: string;
    /** The time zone of the machine. */
    timeZone?: string;
}

export interface RunResult {
    code: number;
    stdout: string;
    stderr: string;
}

export interface Fixture {
    /** The folder of the project. */
    root: string;
    /** The working directory of the CLI. */
    cwd: string;
    run(...argv: string[]): Promise<RunResult>;
    /** Reads a file of the project. */
    read(file: string): Promise<string>;
}

/** The working directory of the CLI, at the root of the drive. */
const cwd = resolve('/repo');

/**
 * Sets up a project in the mocked file system, with fakes for moon, git, and the clock. Load the mock in the test file
 * first, with `await vi.hoisted(() => import('@dnd-mapp/testing/file-system'))`. Without it, the modules that import
 * `node:fs` before the mock loads keep the real one, so the test reads from `/repo` on the real disk and fails.
 */
export function createFixture(options: FixtureOptions = {}): Fixture {
    const project = options.project ?? 'web';
    const root = join(cwd, 'apps', project);
    const manifest =
        options.manifest ?? `${JSON.stringify({ name: project, version: options.version ?? '0.0.0' }, null, 2)}\n`;

    mockFileSystem({
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
                resolveProject: (id) => {
                    if (id !== project) {
                        return Promise.reject(new Error(`moon has no project with the id ${id}`));
                    }
                    return Promise.resolve(root);
                },
                listTags: (id) => Promise.resolve((options.tags ?? []).filter((tag) => tag.startsWith(`${id}@v`))),
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
