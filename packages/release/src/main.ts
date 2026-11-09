#!/usr/bin/env node
import { listGitTags } from './adapters/git.ts';
import { run } from './cli.ts';

const cwd = process.cwd();

process.exitCode = await run(process.argv.slice(2), {
    cwd,
    listTags: (prefix) => listGitTags(prefix, cwd),
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
