import { lintChangelog } from '../changelog.ts';
import type { Dependencies } from '../cli.ts';
import { ReleaseError } from '../errors.ts';
import { type Project, readChangelog } from '../project.ts';

/** The arguments of `release lint`. */
export interface LintOptions {
    /** The project whose changelog to lint. */
    project: Project;
}

/** Prints each problem of the changelog of a project, and fails when it has any. */
export async function lint(options: LintOptions, deps: Dependencies): Promise<void> {
    const { project } = options;
    const problems = lintChangelog(await readChangelog(project), project);

    if (problems.length > 0) {
        for (const problem of problems) {
            deps.stderr(`${project.changelogName}:${String(problem.line)}: ${problem.message}\n`);
        }
        const count = problems.length;
        throw new ReleaseError(`${project.changelogName} has ${String(count)} ${count === 1 ? 'problem' : 'problems'}`);
    }
    deps.stdout(`${project.changelogName} follows Keep a Changelog\n`);
}
