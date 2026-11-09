import { parseArgs } from 'node:util';
import { bump } from './commands/bump.ts';
import { lint } from './commands/lint.ts';
import { notes } from './commands/notes.ts';
import { verify } from './commands/verify.ts';
import { ReleaseError } from './errors.ts';
import { resolveProject } from './project.ts';
import { findLayout } from './workspace.ts';

/** The boundaries of the CLI, which tests replace. */
export interface Dependencies {
    /** The working directory, which holds the repository and which relative paths resolve from. */
    cwd: string;
    /** Lists the tags that start with a prefix, such as `web@v`. */
    listTags(prefix: string): Promise<string[]>;
    /** The clock that dates a release. */
    clock: {
        /** The current time. */
        now(): Date;
        /** The IANA time zone of the machine. */
        timeZone(): string;
    };
    /** Writes text to standard output, which holds the result of a command. */
    stdout(text: string): void;
    /** Writes text to standard error, which holds errors and problems. */
    stderr(text: string): void;
}

/** The commands and their arguments, which a usage error prints. */
const usage = `Usage:
  release bump [<project>] <auto|major|minor|patch> [--timezone <zone>] [--json]
  release verify [<project>] [<version>]
  release notes [<project>] <version> <file>
  release lint [<project>]

In a workspace, <project> is the name of a package without its scope, such as web
for @dnd-mapp/web. In a repository with one package, leave it out.
`;

const commands = new Set(['bump', 'verify', 'notes', 'lint']);

/** Runs the CLI with the arguments after the executable, and resolves to the exit code. */
export async function run(argv: string[], deps: Dependencies): Promise<number> {
    try {
        const { positionals, values } = parseArguments(argv);
        const [command, ...args] = positionals;

        if (command !== 'bump') {
            const option = values.json ? '--json' : values.timezone !== undefined ? '--timezone' : undefined;

            if (option) {
                throw new UsageError(`${option} applies to bump only`);
            }
        }
        if (command === undefined || !commands.has(command)) {
            throw new UsageError(command === undefined ? 'missing command' : `unknown command ${command}`);
        }
        const layout = await findLayout(deps.cwd);
        // A workspace names the project in the first argument, and a repository with one package leaves it out.
        const named = layout.kind === 'workspace' ? 1 : 0;
        const resolve = () => resolveProject(layout, named ? args[0] : undefined, deps.cwd);

        switch (command) {
            case 'bump': {
                const [level] = expectArgs(args, named, 1, 1);
                await bump({ project: await resolve(), level, json: values.json, timeZone: values.timezone }, deps);
                break;
            }
            case 'verify': {
                const [version] = expectArgs(args, named, 0, 1);
                await verify({ project: await resolve(), version }, deps);
                break;
            }
            case 'notes': {
                const [version, file] = expectArgs(args, named, 2, 2);
                await notes({ project: await resolve(), version, file }, deps);
                break;
            }
            default: {
                expectArgs(args, named, 0, 0);
                await lint({ project: await resolve() }, deps);
            }
        }
        return 0;
    } catch (error) {
        if (error instanceof UsageError) {
            deps.stderr(`release: ${error.message}\n\n${usage}`);
        } else if (error instanceof ReleaseError) {
            deps.stderr(`release: ${error.message}\n`);
        } else {
            throw error;
        }
        return 1;
    }
}

class UsageError extends Error {}

/** Parses the positional arguments and the options of `bump`, and turns a parse failure into a usage error. */
function parseArguments(argv: string[]) {
    try {
        return parseArgs({
            args: argv,
            allowPositionals: true,
            options: {
                json: { type: 'boolean', default: false },
                timezone: { type: 'string' },
            },
        });
    } catch (error) {
        throw new UsageError(error instanceof Error ? error.message : String(error));
    }
}

/**
 * Checks the number of positional arguments of a command, after the `named` arguments that name the project, and
 * returns the arguments after those.
 */
function expectArgs<Min extends number>(args: string[], named: number, min: Min, max: number): Arguments<Min> {
    const [low, high] = [min + named, max + named];

    if (args.length < low || args.length > high) {
        const expected = low === high ? String(low) : `${String(low)} to ${String(high)}`;
        throw new UsageError(
            `expected ${expected} ${high === 1 ? 'argument' : 'arguments'}, got ${String(args.length)}`,
        );
    }
    return args.slice(named) as Arguments<Min>;
}

/** The arguments that `expectArgs` returns for a minimum of `Min`: one optional for 0, one for 1, two otherwise. */
type Arguments<Min extends number> = Min extends 0 ? [string?] : Min extends 1 ? [string] : [string, string];
