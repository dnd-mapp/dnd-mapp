#!/usr/bin/env node
import { resolveMoonProject } from './adapters/moon.ts';
import { run } from './cli.ts';

const cwd = process.cwd();

process.exitCode = await run(process.argv.slice(2), {
    cwd,
    resolveProject: (id) => resolveMoonProject(id, cwd),
    stdout: (text) => {
        process.stdout.write(text);
    },
    stderr: (text) => {
        process.stderr.write(text);
    },
});
