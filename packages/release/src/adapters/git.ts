import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/** Lists the tags of the git repository in `cwd` that start with `prefix`, such as `web@v`. */
export async function listGitTags(prefix: string, cwd: string): Promise<string[]> {
    const { stdout } = await execFileAsync('git', ['tag', '--list', `${prefix}*`], { cwd });

    return stdout.split(/\r?\n/).filter((tag) => tag !== '');
}
