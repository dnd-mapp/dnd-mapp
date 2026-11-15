import type { ExecException } from 'node:child_process';
import { promisify } from 'node:util';
import { type Output, Repository } from './repository.ts';

/** The repository of the mock, which every test of a test file shares until `mockGit` replaces its state. */
export const repository = new Repository();

type Callback = (error: ExecException | null, stdout: string, stderr: string) => void;

/** Runs `file` with `args` in the mocked repository, which answers only for git. */
function run(file: string, args: unknown): Output {
    if (file !== 'git') {
        throw new Error(`the git mock runs only git, not ${file}`);
    }
    return repository.run(Array.isArray(args) ? (args as string[]) : []);
}

/**
 * Takes the arguments of `execFile` in any of its forms, `(file, args?, options?, callback?)`, and calls back with the
 * output on a later tick, as the real `execFile` does once git exits. The options, such as `cwd`, change nothing.
 */
function execFile(file: string, ...rest: unknown[]): void {
    const callback = rest.findLast((value) => typeof value === 'function') as Callback | undefined;

    void Promise.try(run, file, rest[0]).then(
        ({ stdout, stderr }) => callback?.(null, stdout, stderr),
        (error: unknown) => callback?.(error as ExecException, '', ''),
    );
}

// The real execFile resolves to { stdout, stderr } through promisify, rather than to the first value of the callback.
Object.defineProperty(execFile, promisify.custom, {
    value: (file: string, args?: unknown): Promise<Output> => Promise.try(run, file, args),
});

/** The mock of `node:child_process`. */
export const childProcess = { execFile };
