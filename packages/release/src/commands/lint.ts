import { lintChangelog } from '../changelog.ts';
import type { Dependencies } from '../cli.ts';
import { ReleaseError } from '../errors.ts';
import { readChangelog, resolveProject } from '../project.ts';

export interface LintOptions {
    project: string;
}

/** Prints each problem of the changelog of a project, and fails when it has any. */
export async function lint(options: LintOptions, deps: Dependencies): Promise<void> {
    const project = await resolveProject(options.project, deps);
    const problems = lintChangelog(await readChangelog(project), project.id);

    if (problems.length > 0) {
        for (const problem of problems) {
            deps.stderr(`${project.changelogName}:${String(problem.line)}: ${problem.message}\n`);
        }
        const count = problems.length;
        throw new ReleaseError(`${project.changelogName} has ${String(count)} ${count === 1 ? 'problem' : 'problems'}`);
    }
    deps.stdout(`${project.changelogName} follows Keep a Changelog\n`);
}
