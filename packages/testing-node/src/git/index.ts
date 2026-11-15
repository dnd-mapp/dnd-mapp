import { vi } from 'vitest';
import { repository } from './child-process.ts';
import type { GitState } from './repository.ts';

export type { GitState } from './repository.ts';

// Vitest hoists this call above the imports of this module, and registers the mock when the module loads. Load the
// module through vi.hoisted, so the mock is in place before the test file imports the code under test.
vi.mock('node:child_process', async () => {
    const { childProcess } = await import('./child-process.ts');

    return { ...childProcess, default: childProcess };
});

/** Replaces the state of the mocked repository with `state`, such as the tags that `git tag --list` lists. */
export function mockGit(state: GitState = {}): void {
    repository.reset(state);
}
