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
    /** The version in `package.json`. */
    version?: string;
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

/** Sets up a project in a temporary folder, with a fake for moon, and removes the folder after the test. */
export async function createFixture(options: FixtureOptions = {}): Promise<Fixture> {
    const project = options.project ?? 'web';
    const cwd = await mkdtemp(join(tmpdir(), 'release-'));
    onTestFinished(() => rm(cwd, { recursive: true, force: true }));

    const root = join(cwd, 'apps', project);
    await mkdir(root, { recursive: true });

    const manifest = { name: project, version: options.version ?? '0.0.0' };
    await writeFile(join(root, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);

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
                stdout: (text) => (stdout += text),
                stderr: (text) => (stderr += text),
            });
            return { code, stdout, stderr };
        },
        read: (file) => readFile(join(cwd, file), 'utf8'),
    };
}
