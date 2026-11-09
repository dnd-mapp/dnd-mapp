import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// Runs the script of the moon package with Node.js rather than the moon shim in node_modules/.bin, which is a .cmd
// file on Windows that Node.js runs only through a shell.
const moon = fileURLToPath(import.meta.resolve('@moonrepo/cli/moon.js'));

/** Resolves a moon id to the absolute folder of its project, through `moon project <id> --json`. */
export async function resolveMoonProject(id: string, cwd: string): Promise<string> {
    let stdout: string;

    try {
        ({ stdout } = await execFileAsync(process.execPath, [moon, 'project', id, '--json'], {
            cwd,
            maxBuffer: 64 * 1024 * 1024,
        }));
    } catch (error) {
        const stderr = error instanceof Error && 'stderr' in error ? String(error.stderr) : '';

        if (stderr.includes('unknown_id')) {
            throw new Error(`moon has no project with the id ${id}`, { cause: error });
        }
        throw new Error(`moon project ${id} failed: ${stderr.trim()}`, { cause: error });
    }
    const { root } = JSON.parse(stdout) as { root: string };
    return root;
}
