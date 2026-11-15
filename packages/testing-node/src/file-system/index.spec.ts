import fsDefault, {
    appendFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    statSync,
    writeFileSync,
} from 'node:fs';
import { access, lstat, mkdir, readdir, readFile, rm, stat, unlink, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const { mockFileSystem } = await vi.hoisted(() => import('./index.ts'));

/** A folder at the root of the current drive, which the real file system does not hold. */
const root = resolve('/repo');
const at = (...segments: string[]) => join(root, ...segments);

describe('mockFileSystem', () => {
    it('mocks node:fs and node:fs/promises with the same files', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        expect(readFileSync(at('a.txt'), 'utf8')).toBe('a');
        expect(await readFile(at('a.txt'), 'utf8')).toBe('a');
        expect(await fsDefault.promises.readFile(at('a.txt'), 'utf8')).toBe('a');
    });

    it('replaces the files of an earlier call', () => {
        mockFileSystem({ [at('a.txt')]: 'a' });
        mockFileSystem({ [at('b.txt')]: 'b' });

        expect(existsSync(at('a.txt'))).toBe(false);
        expect(existsSync(at('b.txt'))).toBe(true);
    });

    it('creates the folders that hold the files', () => {
        mockFileSystem({ [at('apps', 'web', 'package.json')]: '{}' });

        expect(statSync(at('apps', 'web')).isDirectory()).toBe(true);
        expect(readdirSync(at('apps'))).toEqual(['web']);
    });

    it('stores bytes as they are', () => {
        mockFileSystem({ [at('a.bin')]: new Uint8Array([0, 255]) });

        expect(readFileSync(at('a.bin'))).toEqual(Buffer.from([0, 255]));
    });

    it('rejects a file below another file', () => {
        expect(() => {
            mockFileSystem({ [at('a')]: 'a', [at('a', 'b')]: 'b' });
        }).toThrow(`cannot add the file ${at('a', 'b')}`);
    });

    it('rejects a file where it creates a folder', () => {
        expect(() => {
            mockFileSystem({ [at('a', 'b')]: 'b', [at('a')]: 'a' });
        }).toThrow(`cannot add the file ${at('a')}`);
    });
});

describe('paths', () => {
    it('resolves a relative path against the working directory', async () => {
        mockFileSystem({ 'a.txt': 'a' });

        expect(await readFile(join(process.cwd(), 'a.txt'), 'utf8')).toBe('a');
    });

    it('resolves forward slashes with node:path', async () => {
        mockFileSystem({ '/repo/apps/web/package.json': '{}' });

        expect(await readFile(at('apps', 'web', 'package.json'), 'utf8')).toBe('{}');
    });

    it('reads a file URL', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        expect(await readFile(pathToFileURL(at('a.txt')), 'utf8')).toBe('a');
    });

    it('reads a path in a buffer', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        expect(await readFile(Buffer.from(at('a.txt')), 'utf8')).toBe('a');
    });

    it('tells names apart by case on every OS', () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        expect(existsSync(at('A.txt'))).toBe(false);
    });

    it.runIf(sep === '\\')('takes either separator and case of drive letter on Windows', async () => {
        mockFileSystem({ 'd:/repo/a.txt': 'a' });

        expect(await readFile('D:\\repo\\a.txt', 'utf8')).toBe('a');
    });
});

describe('readFile', () => {
    it('returns a buffer without an encoding', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        expect(await readFile(at('a.txt'))).toEqual(Buffer.from('a'));
        expect(await readFile(at('a.txt'), { encoding: 'utf8' })).toBe('a');
    });

    it('returns a copy of the content', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        (await readFile(at('a.txt'))).fill(0);

        expect(await readFile(at('a.txt'), 'utf8')).toBe('a');
    });

    it('fails with ENOENT for a missing file', async () => {
        mockFileSystem();

        await expect(readFile(at('a.txt'))).rejects.toMatchObject({
            code: 'ENOENT',
            syscall: 'open',
            path: at('a.txt'),
            message: `ENOENT: no such file or directory, open '${at('a.txt')}'`,
        });
    });

    it('fails with ENOTDIR below a file, as on Linux', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        await expect(readFile(at('a.txt', 'b'))).rejects.toMatchObject({ code: 'ENOTDIR', syscall: 'open' });
    });

    it('fails with EISDIR for a folder, without a path', async () => {
        mockFileSystem({ [at('a', 'b.txt')]: 'b' });

        const error: unknown = await readFile(at('a')).catch((reason: unknown) => reason);

        expect(error).toMatchObject({
            code: 'EISDIR',
            syscall: 'read',
            message: 'EISDIR: illegal operation on a directory, read',
        });
        expect(error).not.toHaveProperty('path');
    });

    it('fails as the real node:fs does for a missing file', async () => {
        const real = await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises');
        const path = resolve('/dnd-mapp-testing-missing.txt');
        const fields = (error: unknown) => {
            const { code, errno, syscall, message } = error as NodeJS.ErrnoException;
            return { code, errno, syscall, path: (error as NodeJS.ErrnoException).path, message };
        };
        mockFileSystem();

        const [actual, mocked] = await Promise.all([
            real.readFile(path).catch((error: unknown) => error),
            readFile(path).catch((error: unknown) => error),
        ]);

        expect(fields(mocked)).toEqual(fields(actual));
    });
});

describe('writeFile', () => {
    it('creates a file, and replaces its content', async () => {
        mockFileSystem();
        mkdirSync(root);

        await writeFile(at('a.txt'), 'a');
        await writeFile(at('a.txt'), 'b');

        expect(await readFile(at('a.txt'), 'utf8')).toBe('b');
    });

    it('writes bytes and text in an encoding', () => {
        mockFileSystem();
        mkdirSync(root);

        writeFileSync(at('a.bin'), new Uint8Array([1, 2]));
        writeFileSync(at('b.txt'), '6869', 'hex');

        expect(readFileSync(at('a.bin'))).toEqual(Buffer.from([1, 2]));
        expect(readFileSync(at('b.txt'), 'utf8')).toBe('hi');
    });

    it('appends with the a flag and appendFile', () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        writeFileSync(at('a.txt'), 'b', { flag: 'a' });
        appendFileSync(at('a.txt'), 'c');
        appendFileSync(at('new.txt'), 'n');

        expect(readFileSync(at('a.txt'), 'utf8')).toBe('abc');
        expect(readFileSync(at('new.txt'), 'utf8')).toBe('n');
    });

    it('fails with EEXIST for an existing file with the wx flag', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        await expect(writeFile(at('a.txt'), 'b', { flag: 'wx' })).rejects.toMatchObject({
            code: 'EEXIST',
            syscall: 'open',
        });
    });

    it('fails with ENOENT in a missing folder', async () => {
        mockFileSystem();

        await expect(writeFile(at('a', 'b.txt'), 'b')).rejects.toMatchObject({
            code: 'ENOENT',
            path: at('a', 'b.txt'),
        });
    });

    it('fails with EISDIR for a folder', async () => {
        mockFileSystem({ [at('a', 'b.txt')]: 'b' });

        await expect(writeFile(at('a'), 'a')).rejects.toMatchObject({ code: 'EISDIR', syscall: 'open', path: at('a') });
    });

    it('fails on a flag the mock does not support', async () => {
        mockFileSystem();

        await expect(writeFile(at('a.txt'), 'a', { flag: 'r+' })).rejects.toThrow('does not support the flag r+');
    });
});

describe('mkdir', () => {
    it('creates a folder in an existing one', async () => {
        mockFileSystem();
        mkdirSync(root);

        await expect(mkdir(at('a'), { recursive: false })).resolves.toBeUndefined();
        mkdirSync(at('a', 'b'), 0o755);

        expect((await stat(at('a', 'b'))).isDirectory()).toBe(true);
    });

    it('creates the missing folders, and returns the first, with recursive', async () => {
        mockFileSystem();

        expect(await mkdir(at('a', 'b', 'c'), { recursive: true })).toBe(at());
        expect(await mkdir(at('a', 'b'), { recursive: true })).toBeUndefined();
        expect(existsSync(at('a', 'b', 'c'))).toBe(true);
    });

    it('fails with EEXIST for an existing folder without recursive', async () => {
        mockFileSystem({ [at('a', 'b.txt')]: 'b' });

        await expect(mkdir(at('a'))).rejects.toMatchObject({ code: 'EEXIST', syscall: 'mkdir', path: at('a') });
    });

    it('fails with EEXIST for a file with recursive', async () => {
        mockFileSystem({ [at('a')]: 'a' });

        await expect(mkdir(at('a'), { recursive: true })).rejects.toMatchObject({ code: 'EEXIST' });
    });

    it('fails with ENOENT in a missing folder', async () => {
        mockFileSystem();

        await expect(mkdir(at('a', 'b'))).rejects.toMatchObject({
            code: 'ENOENT',
            syscall: 'mkdir',
            path: at('a', 'b'),
        });
    });

    it('fails with ENOTDIR below a file', async () => {
        mockFileSystem({ [at('a')]: 'a' });

        await expect(mkdir(at('a', 'b'), { recursive: true })).rejects.toMatchObject({
            code: 'ENOTDIR',
            syscall: 'mkdir',
        });
    });
});

describe('readdir', () => {
    const files = { [at('b.txt')]: 'b', [at('a', 'c.txt')]: 'c', [at('a', 'd', 'e.txt')]: 'e' };

    it('lists the names in a folder, sorted', async () => {
        mockFileSystem(files);

        expect(await readdir(root)).toEqual(['a', 'b.txt']);
    });

    it('lists every path below a folder with recursive', async () => {
        mockFileSystem(files);

        expect(await readdir(at('a'), { recursive: true })).toEqual(['c.txt', 'd', join('d', 'e.txt')]);
    });

    it('lists entries with their type', async () => {
        mockFileSystem(files);

        const entries = await readdir(at('a'), { withFileTypes: true, recursive: true });

        expect(entries.map((entry) => [entry.name, entry.parentPath, entry.isFile(), entry.isDirectory()])).toEqual([
            ['c.txt', at('a'), true, false],
            ['d', at('a'), false, true],
            ['e.txt', at('a', 'd'), true, false],
        ]);
        expect(entries.map((entry) => [entry.isSymbolicLink(), entry.isFIFO(), entry.isSocket()])).toEqual(
            Array(3).fill([false, false, false]),
        );
        expect(entries.map((entry) => [entry.isBlockDevice(), entry.isCharacterDevice()])).toEqual(
            Array(3).fill([false, false]),
        );
    });

    it('shows only the fields of fs.Dirent on an entry', async () => {
        mockFileSystem(files);

        const entries = await readdir(at('a'), { withFileTypes: true });

        expect(entries.map((entry) => Object.keys(entry))).toEqual(Array(2).fill(['name', 'parentPath']));
    });

    it('fails with ENOENT for a missing folder, and ENOTDIR for a file', async () => {
        mockFileSystem(files);

        await expect(readdir(at('x'))).rejects.toMatchObject({ code: 'ENOENT', syscall: 'scandir' });
        await expect(readdir(at('b.txt'))).rejects.toMatchObject({ code: 'ENOTDIR', syscall: 'scandir' });
    });
});

describe('stat', () => {
    it('reports the type, size, and times of a file', async () => {
        mockFileSystem({ [at('a.txt')]: 'abc' });

        const stats = await stat(at('a.txt'));

        expect(stats).toMatchObject({ size: 3, blocks: 1, mode: 0o100644 });
        expect(stats.mtime).toBeInstanceOf(Date);
        expect(stats.mtimeMs).toBe(stats.mtime.getTime());
        expect([stats.isFile(), stats.isDirectory(), stats.isSymbolicLink()]).toEqual([true, false, false]);
        expect([stats.isFIFO(), stats.isSocket(), stats.isBlockDevice(), stats.isCharacterDevice()]).toEqual([
            false,
            false,
            false,
            false,
        ]);
    });

    it('shows no field beyond those of fs.Stats', async () => {
        mockFileSystem({ [at('a.txt')]: 'abc' });

        expect(Object.keys(await stat(at('a.txt')))).not.toContain('kind');
    });

    it('reports a folder, and the root of the drive', async () => {
        mockFileSystem({ [at('a.txt')]: 'abc' });

        expect((await lstat(root)).isDirectory()).toBe(true);
        expect((await stat(resolve('/'))).isDirectory()).toBe(true);
    });

    it('fails with ENOENT for a missing path, with the name of the call', async () => {
        mockFileSystem();

        await expect(stat(at('a'))).rejects.toMatchObject({ code: 'ENOENT', syscall: 'stat' });
        await expect(lstat(at('a'))).rejects.toMatchObject({ code: 'ENOENT', syscall: 'lstat' });
    });
});

describe('access', () => {
    it('resolves for an existing path, and fails with ENOENT for a missing one', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        await expect(access(at('a.txt'))).resolves.toBeUndefined();
        await expect(access(at('b.txt'))).rejects.toMatchObject({ code: 'ENOENT', syscall: 'access' });
    });
});

describe('rm', () => {
    it('removes a file', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        await rm(at('a.txt'));

        expect(existsSync(at('a.txt'))).toBe(false);
    });

    it('removes a folder and everything below it with recursive', async () => {
        mockFileSystem({ [at('a', 'b', 'c.txt')]: 'c', [at('ab.txt')]: 'ab' });

        await rm(at('a'), { recursive: true });

        expect(await readdir(root, { recursive: true })).toEqual(['ab.txt']);
    });

    it('fails for a folder without recursive', async () => {
        mockFileSystem({ [at('a', 'b.txt')]: 'b' });

        await expect(rm(at('a'))).rejects.toMatchObject({ code: 'ERR_FS_EISDIR', syscall: 'rm', path: at('a') });
    });

    it('fails with ENOENT for a missing path, unless forced', async () => {
        mockFileSystem();

        await expect(rm(at('a'))).rejects.toMatchObject({ code: 'ENOENT', syscall: 'lstat' });
        await expect(rm(at('a'), { force: true })).resolves.toBeUndefined();
    });
});

describe('unlink', () => {
    it('removes a file', async () => {
        mockFileSystem({ [at('a.txt')]: 'a' });

        await unlink(at('a.txt'));

        expect(existsSync(at('a.txt'))).toBe(false);
    });

    it('fails with ENOENT for a missing file, and EISDIR for a folder, as on Linux', async () => {
        mockFileSystem({ [at('a', 'b.txt')]: 'b' });

        await expect(unlink(at('x'))).rejects.toMatchObject({ code: 'ENOENT', syscall: 'unlink' });
        await expect(unlink(at('a'))).rejects.toMatchObject({ code: 'EISDIR', syscall: 'unlink' });
    });
});
