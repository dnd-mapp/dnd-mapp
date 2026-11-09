import { getSystemErrorMap } from 'node:util';

/** The codes of the system errors that the mock throws. */
export type ErrorCode = 'EEXIST' | 'EISDIR' | 'ENOENT' | 'ENOTDIR';

/** The errno and description of each system error, as Node.js reports them on this OS. */
const systemErrors = new Map(
    [...getSystemErrorMap()].map(([errno, [code, description]]) => [code, { errno, description }]),
);

/**
 * Creates the error that Node.js throws when a system call fails, such as
 * `ENOENT: no such file or directory, open '/repo/a.txt'`. Leave out `path` for the calls that Node.js reports without
 * one, such as reading a folder.
 */
export function systemError(code: ErrorCode, syscall: string, path?: string): NodeJS.ErrnoException {
    const known = systemErrors.get(code);

    if (known === undefined) {
        throw new Error(`Node.js knows no system error ${code} on this OS`);
    }
    const { errno, description } = known;
    const message = `${code}: ${description}, ${syscall}${path === undefined ? '' : ` '${path}'`}`;

    return Object.assign(new Error(message), { errno, code, syscall, ...(path !== undefined && { path }) });
}

/** Creates the error that `rm` throws for a folder without the `recursive` option. */
export function directoryError(path: string): NodeJS.ErrnoException {
    return Object.assign(new Error(`Path is a directory: rm returned EISDIR (is a directory) ${path}`), {
        errno: 21,
        code: 'ERR_FS_EISDIR',
        syscall: 'rm',
        path,
    });
}
