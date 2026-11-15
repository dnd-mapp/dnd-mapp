import { vi } from 'vitest';
import { volume } from './node-fs.ts';
import type { Files } from './volume.ts';

export type { FileContent, Files } from './volume.ts';

// Vitest hoists these calls above the imports of this module, and registers the mocks when the module loads. Load the
// module through vi.hoisted, so the mocks are in place before the test file imports the code under test.
vi.mock('node:fs', async () => {
    const { fs } = await import('./node-fs.ts');

    return { ...fs, default: fs };
});

vi.mock('node:fs/promises', async () => {
    const { promises } = await import('./node-fs.ts');

    return { ...promises, default: promises };
});

/**
 * Replaces the files of the mocked file system with `files`, and creates the folders that hold them. A relative path
 * resolves against the working directory.
 */
export function mockFileSystem(files: Files = {}): void {
    volume.reset(files);
}
