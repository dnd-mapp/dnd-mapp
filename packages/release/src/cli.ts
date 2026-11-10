import { parseArgs } from 'node:util';
import { bump } from './commands/bump.ts';
import { lint } from './commands/lint.ts';
import { notes } from './commands/notes.ts';
import { verify } from './commands/verify.ts';
import { ReleaseError } from './errors.ts';
import { resolveProject } from './project.ts';

/** The boundaries of the CLI, which tests replace. */
export interface Dependencies {
    /** The working directory, which holds the package of the project and which relative paths resolve from. */
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
  release bump <auto|major|minor|patch> [--timezone <zone>] [--json]
  release verify [<version>]
  release notes <version> <file>
  release lint

Each command acts on the package.json and CHANGELOG.md in the working directory.
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
        const resolve = () => resolveProject(deps.cwd);

        switch (command) {
            case 'bump': {
                const [level] = expectArgs(args, 1, 1);
                await bump({ project: await resolve(), level, json: values.json, timeZone: values.timezone }, deps);
                break;
            }
            case 'verify': {
                const [version] = expectArgs(args, 0, 1);
                await verify({ project: await resolve(), version }, deps);
                break;
            }
            case 'notes': {
                const [version, file] = expectArgs(args, 2, 2);
                await notes({ project: await resolve(), version, file }, deps);
                break;
            }
            default: {
                expectArgs(args, 0, 0);
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

/** Checks the number of positional arguments of a command, and returns them. */
function expectArgs<Min extends number>(args: string[], min: Min, max: number): Arguments<Min> {
    if (args.length < min || args.length > max) {
        const expected = min === max ? String(min) : `${String(min)} to ${String(max)}`;
        throw new UsageError(
            `expected ${expected} ${max === 1 ? 'argument' : 'arguments'}, got ${String(args.length)}`,
        );
    }
    return args as Arguments<Min>;
}

/** The arguments that `expectArgs` returns for a minimum of `Min`: one optional for 0, one for 1, two otherwise. */
type Arguments<Min extends number> = Min extends 0 ? [string?] : Min extends 1 ? [string] : [string, string];
