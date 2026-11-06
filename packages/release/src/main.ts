#!/usr/bin/env node
import { listGitTags } from './adapters/git.ts';
import { resolveMoonProject } from './adapters/moon.ts';
import { run } from './cli.ts';

const cwd = process.cwd();

process.exitCode = await run(process.argv.slice(2), {
    cwd,
    resolveProject: (id) => resolveMoonProject(id, cwd),
    listTags: (project) => listGitTags(project, cwd),
    clock: {
        now: () => new Date(),
        timeZone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    stdout: (text) => {
        process.stdout.write(text);
    },
    stderr: (text) => {
        process.stderr.write(text);
    },
});
