import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { onTestFinished } from 'vitest';
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

/**
 * Sets up a project in a temporary folder, with fakes for moon, git, and the clock, and removes the folder after the
 * test.
 */
export async function createFixture(options: FixtureOptions = {}): Promise<Fixture> {
    const project = options.project ?? 'web';
    const cwd = await mkdtemp(join(tmpdir(), 'release-'));
    onTestFinished(() => rm(cwd, { recursive: true, force: true }));

    const root = join(cwd, 'apps', project);
    await mkdir(root, { recursive: true });

    const manifest =
        options.manifest ?? `${JSON.stringify({ name: project, version: options.version ?? '0.0.0' }, null, 2)}\n`;
    await writeFile(join(root, 'package.json'), manifest);

    if (options.changelog !== undefined) {
        await writeFile(join(root, 'CHANGELOG.md'), options.changelog);
    }
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
