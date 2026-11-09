import { Buffer } from 'node:buffer';
import { basename, dirname, isAbsolute, parse, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { directoryError, systemError } from './errors.ts';

/** A path as the functions of `node:fs` take it. */
export type PathLike = string | Buffer | URL;

/** The content of a file: text, stored as UTF-8, or bytes. */
export type FileContent = string | Uint8Array;

/** The content of each file by its path. A relative path resolves against the working directory. */
export type Files = Record<string, FileContent>;

/** The flags of `writeFile` that the mock supports: write, append, and either of them only when the file is new. */
export type WriteFlag = 'w' | 'wx' | 'a' | 'ax';

type Entry = { kind: 'file'; content: Buffer; modified: Date } | { kind: 'directory'; modified: Date };

/** An entry of a folder, as `readdir` lists it. */
export interface Listing {
    /** The path of the entry relative to the folder that `readdir` lists. */
    path: string;
    /** The name of the entry. */
    name: string;
    /** The folder that holds the entry. */
    parentPath: string;
    kind: Entry['kind'];
}

/** The size and times of an entry, as `stat` reports them. */
export interface Status {
    kind: Entry['kind'];
    size: number;
    modified: Date;
}

/** The root of each drive, which always exists. */
const rootEntry: Entry = { kind: 'directory', modified: new Date(0) };

/**
 * Resolves a path against the working directory with `node:path`, as `node:fs` does. On Windows, the path takes
 * backslashes and an uppercase drive letter, so `d:/repo/a.txt` and `D:\repo\a.txt` name the same file.
 */
export function toPath(path: PathLike): string {
    const text = path instanceof URL ? fileURLToPath(path) : path.toString();

    return resolve(text).replace(/^[a-z]:/, (drive) => drive.toUpperCase());
}

function isRoot(path: string): boolean {
    return parse(path).root === path;
}

/** Whether `path` lies anywhere below the folder `directory`. */
function isInside(directory: string, path: string): boolean {
    const between = relative(directory, path);

    return between !== '' && !between.startsWith('..') && !isAbsolute(between);
}

function toBuffer(content: FileContent): Buffer {
    return typeof content === 'string' ? Buffer.from(content, 'utf8') : Buffer.from(content);
}

/**
 * The files and folders of the mock, kept in memory. Each method throws the error that `node:fs` throws on Linux, so
 * a test fails the same way on every OS. Names are case-sensitive on every OS for the same reason.
 */
export class Volume {
    readonly #entries = new Map<string, Entry>();

    /** Replaces every file and folder with `files`, and creates the folders that hold them. */
    reset(files: Files = {}): void {
        this.#entries.clear();

        for (const [path, content] of Object.entries(files)) {
            const file = toPath(path);

            if (this.#get(file) !== undefined || this.#hasFileAbove(file)) {
                throw new Error(`cannot add the file ${file}, since a path of another file holds it or lies below it`);
            }
            this.#createDirectories(dirname(file));
            this.#entries.set(file, { kind: 'file', content: toBuffer(content), modified: new Date() });
        }
    }

    readFile(path: PathLike): Buffer {
        const file = toPath(path);
        const entry = this.#get(file);

        if (entry === undefined) {
            throw this.#missing(file, 'open');
        }
        if (entry.kind === 'directory') {
            throw systemError('EISDIR', 'read');
        }
        return Buffer.from(entry.content);
    }

    writeFile(path: PathLike, content: FileContent, flag: WriteFlag = 'w'): void {
        const file = toPath(path);
        const entry = this.#get(file);

        if (entry !== undefined && flag.endsWith('x')) {
            throw systemError('EEXIST', 'open', file);
        }
        if (entry?.kind === 'directory') {
            throw systemError('EISDIR', 'open', file);
        }
        if (entry === undefined && this.#get(dirname(file))?.kind !== 'directory') {
            throw this.#missing(file, 'open');
        }
        const data = toBuffer(content);

        this.#entries.set(file, {
            kind: 'file',
            content: entry !== undefined && flag.startsWith('a') ? Buffer.concat([entry.content, data]) : data,
            modified: new Date(),
        });
    }

    /** Creates a folder, and returns the first folder it created when `recursive` is set, as `mkdir` does. */
    mkdir(path: PathLike, recursive = false): string | undefined {
        const directory = toPath(path);
        const entry = this.#get(directory);

        if (entry !== undefined) {
            if (recursive && entry.kind === 'directory') {
                return undefined;
            }
            throw systemError('EEXIST', 'mkdir', directory);
        }
        if (this.#hasFileAbove(directory)) {
            throw systemError('ENOTDIR', 'mkdir', directory);
        }
        if (!recursive) {
            if (this.#get(dirname(directory)) === undefined) {
                throw systemError('ENOENT', 'mkdir', directory);
            }
            this.#entries.set(directory, { kind: 'directory', modified: new Date() });

            return undefined;
        }
        return this.#createDirectories(directory);
    }

    /** Lists the entries of a folder, or every entry below it when `recursive` is set, sorted by path. */
    readdir(path: PathLike, recursive = false): Listing[] {
        const directory = toPath(path);
        const entry = this.#get(directory);

        if (entry === undefined) {
            throw this.#missing(directory, 'scandir');
        }
        if (entry.kind === 'file') {
            throw systemError('ENOTDIR', 'scandir', directory);
        }
        const listings: Listing[] = [];

        for (const [child, { kind }] of this.#entries) {
            const parentPath = dirname(child);

            if (recursive ? isInside(directory, child) : parentPath === directory) {
                listings.push({ path: relative(directory, child), name: basename(child), parentPath, kind });
            }
        }
        return listings.sort((a, b) => (a.path < b.path ? -1 : 1));
    }

    stat(path: PathLike, syscall: 'stat' | 'lstat' = 'stat'): Status {
        const target = toPath(path);
        const entry = this.#get(target);

        if (entry === undefined) {
            throw this.#missing(target, syscall);
        }
        return { kind: entry.kind, size: entry.kind === 'file' ? entry.content.length : 0, modified: entry.modified };
    }

    /** Checks that a path exists. The mock grants every permission, so it ignores the mode of `access`. */
    access(path: PathLike): void {
        const target = toPath(path);

        if (this.#get(target) === undefined) {
            throw this.#missing(target, 'access');
        }
    }

    exists(path: PathLike): boolean {
        return this.#get(toPath(path)) !== undefined;
    }

    rm(path: PathLike, { recursive = false, force = false } = {}): void {
        const target = toPath(path);
        const entry = this.#get(target);

        if (entry === undefined) {
            if (force) {
                return;
            }
            throw this.#missing(target, 'lstat');
        }
        if (entry.kind === 'directory') {
            if (!recursive) {
                throw directoryError(target);
            }
            for (const child of [...this.#entries.keys()]) {
                if (isInside(target, child)) {
                    this.#entries.delete(child);
                }
            }
        }
        this.#entries.delete(target);
    }

    unlink(path: PathLike): void {
        const file = toPath(path);
        const entry = this.#get(file);

        if (entry === undefined) {
            throw this.#missing(file, 'unlink');
        }
        if (entry.kind === 'directory') {
            throw systemError('EISDIR', 'unlink', file);
        }
        this.#entries.delete(file);
    }

    #get(path: string): Entry | undefined {
        return isRoot(path) ? rootEntry : this.#entries.get(path);
    }

    /** Whether a file stands where a folder above `path` should be. */
    #hasFileAbove(path: string): boolean {
        for (let parent = dirname(path); !isRoot(parent); parent = dirname(parent)) {
            if (this.#entries.get(parent)?.kind === 'file') {
                return true;
            }
        }
        return false;
    }

    /** The error for a path that does not exist: `ENOTDIR` when a file stands above it, as on Linux, else `ENOENT`. */
    #missing(path: string, syscall: string): NodeJS.ErrnoException {
        return systemError(this.#hasFileAbove(path) ? 'ENOTDIR' : 'ENOENT', syscall, path);
    }

    /** Creates a folder and the missing folders above it, and returns the first one it created. */
    #createDirectories(directory: string): string | undefined {
        const missing: string[] = [];

        for (let current = directory; this.#get(current) === undefined; current = dirname(current)) {
            missing.push(current);
        }
        for (const folder of missing.toReversed()) {
            this.#entries.set(folder, { kind: 'directory', modified: new Date() });
        }
        return missing.at(-1);
    }
}
