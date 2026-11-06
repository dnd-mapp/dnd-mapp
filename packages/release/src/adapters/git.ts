import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/** Lists the `<project>@v*` tags of the git repository in `cwd`. */
export async function listGitTags(project: string, cwd: string): Promise<string[]> {
    const { stdout } = await execFileAsync('git', ['tag', '--list', `${project}@v*`], { cwd });

    return stdout.split(/\r?\n/).filter((tag) => tag !== '');
}
