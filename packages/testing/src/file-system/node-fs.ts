import { Buffer } from 'node:buffer';
import { type Listing, type PathLike, type Status, Volume, type WriteFlag } from './volume.ts';

/** The files of the mock, which every test of a test file shares until `mockFileSystem` replaces them. */
export const volume = new Volume();

type Encoding = BufferEncoding | null | undefined;
type ReadOptions = Encoding | { encoding?: Encoding; flag?: string };
type WriteOptions = Encoding | { encoding?: Encoding; flag?: string; mode?: number };
type ReaddirOptions = Encoding | { encoding?: Encoding; withFileTypes?: boolean; recursive?: boolean };

const writeFlags = new Set<string>(['w', 'wx', 'a', 'ax'] satisfies WriteFlag[]);

function encodingOf(options: ReadOptions | WriteOptions | ReaddirOptions): Encoding {
    return typeof options === 'object' && options !== null ? options.encoding : options;
}

function flagOf(options: WriteOptions, fallback: WriteFlag): WriteFlag {
    const flag = typeof options === 'object' && options !== null ? (options.flag ?? fallback) : fallback;

    if (!writeFlags.has(flag)) {
        throw new Error(`the file system mock does not support the flag ${flag}`);
    }
    return flag as WriteFlag;
}

function toContent(data: string | NodeJS.ArrayBufferView, encoding: Encoding): string | Uint8Array {
    if (typeof data === 'string') {
        return encoding === null || encoding === undefined ? data : Buffer.from(data, encoding);
    }
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

/** The status of a file or folder, with the fields and methods of `fs.Stats`. */
class Stats {
    readonly dev = 0;
    readonly ino = 0;
    readonly mode: number;
    readonly nlink = 1;
    readonly uid = 0;
    readonly gid = 0;
    readonly rdev = 0;
    readonly size: number;
    readonly blksize = 4096;
    readonly blocks: number;
    readonly atimeMs: number;
    readonly mtimeMs: number;
    readonly ctimeMs: number;
    readonly birthtimeMs: number;
    readonly atime: Date;
    readonly mtime: Date;
    readonly ctime: Date;
    readonly birthtime: Date;
    readonly #kind: Status['kind'];

    constructor({ kind, size, modified }: Status) {
        this.#kind = kind;
        this.mode = kind === 'file' ? 0o100644 : 0o40755;
        this.size = size;
        this.blocks = Math.ceil(size / 512);
        this.atimeMs = this.mtimeMs = this.ctimeMs = this.birthtimeMs = modified.getTime();
        this.atime = this.mtime = this.ctime = this.birthtime = modified;
    }

    isFile(): boolean {
        return this.#kind === 'file';
    }

    isDirectory(): boolean {
        return this.#kind === 'directory';
    }

    isBlockDevice(): boolean {
        return false;
    }

    isCharacterDevice(): boolean {
        return false;
    }

    isSymbolicLink(): boolean {
        return false;
    }

    isFIFO(): boolean {
        return false;
    }

    isSocket(): boolean {
        return false;
    }
}

/** An entry of a folder, with the fields and methods of `fs.Dirent`. */
class Dirent {
    readonly name: string;
    readonly parentPath: string;
    readonly #kind: Listing['kind'];

    constructor({ name, parentPath, kind }: Listing) {
        this.name = name;
        this.parentPath = parentPath;
        this.#kind = kind;
    }

    isFile(): boolean {
        return this.#kind === 'file';
    }

    isDirectory(): boolean {
        return this.#kind === 'directory';
    }

    isBlockDevice(): boolean {
        return false;
    }

    isCharacterDevice(): boolean {
        return false;
    }

    isSymbolicLink(): boolean {
        return false;
    }

    isFIFO(): boolean {
        return false;
    }

    isSocket(): boolean {
        return false;
    }
}

/** The synchronous functions of `node:fs` that the mock supports. */
const sync = {
    readFileSync: (path: PathLike, options?: ReadOptions): string | Buffer => {
        const content = volume.readFile(path);
        const encoding = encodingOf(options);

        return encoding === null || encoding === undefined ? content : content.toString(encoding);
    },

    writeFileSync: (path: PathLike, data: string | NodeJS.ArrayBufferView, options?: WriteOptions): void => {
        volume.writeFile(path, toContent(data, encodingOf(options)), flagOf(options, 'w'));
    },

    appendFileSync: (path: PathLike, data: string | NodeJS.ArrayBufferView, options?: WriteOptions): void => {
        volume.writeFile(path, toContent(data, encodingOf(options)), flagOf(options, 'a'));
    },

    mkdirSync: (path: PathLike, options?: number | { recursive?: boolean; mode?: number }): string | undefined => {
        return volume.mkdir(path, typeof options === 'object' && options.recursive === true);
    },

    readdirSync: (path: PathLike, options?: ReaddirOptions): string[] | Dirent[] => {
        const recursive = typeof options === 'object' && options?.recursive === true;
        const listings = volume.readdir(path, recursive);

        if (typeof options === 'object' && options?.withFileTypes === true) {
            return listings.map((listing) => new Dirent(listing));
        }
        return listings.map(({ path: entry }) => entry);
    },

    statSync: (path: PathLike): Stats => {
        return new Stats(volume.stat(path));
    },

    // The mock has no symbolic links, so lstat reports the same status as stat.
    lstatSync: (path: PathLike): Stats => {
        return new Stats(volume.stat(path, 'lstat'));
    },

    accessSync: (path: PathLike): void => {
        volume.access(path);
    },

    existsSync: (path: PathLike): boolean => {
        return volume.exists(path);
    },

    rmSync: (path: PathLike, options?: { recursive?: boolean; force?: boolean }): void => {
        volume.rm(path, { recursive: options?.recursive === true, force: options?.force === true });
    },

    unlinkSync: (path: PathLike): void => {
        volume.unlink(path);
    },
};

/** Wraps a synchronous function in one that returns a promise, which rejects with the error it throws. */
function toAsync<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => Promise<R> {
    return (...args) => Promise.try(fn, ...args);
}

/** The mock of `node:fs/promises`. */
export const promises = {
    readFile: toAsync(sync.readFileSync),
    writeFile: toAsync(sync.writeFileSync),
    appendFile: toAsync(sync.appendFileSync),
    mkdir: toAsync(sync.mkdirSync),
    readdir: toAsync(sync.readdirSync),
    stat: toAsync(sync.statSync),
    lstat: toAsync(sync.lstatSync),
    access: toAsync(sync.accessSync),
    rm: toAsync(sync.rmSync),
    unlink: toAsync(sync.unlinkSync),
};

/** The mock of `node:fs`, which holds the synchronous functions and the promises API. */
export const fs = { ...sync, promises };
