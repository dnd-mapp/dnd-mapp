import { parseArgs } from 'node:util';
import { bump } from './commands/bump.ts';
import { lint } from './commands/lint.ts';
import { notes } from './commands/notes.ts';
import { verify } from './commands/verify.ts';
import { ReleaseError } from './errors.ts';

/** The boundaries of the CLI, which tests replace. */
export interface Dependencies {
    /** The working directory, which relative paths resolve from. */
    cwd: string;
    /** Resolves a moon id to the absolute folder of its project. */
    resolveProject(id: string): Promise<string>;
    clock: {
        now(): Date;
        /** The IANA time zone of the machine. */
        timeZone(): string;
    };
    stdout(text: string): void;
    stderr(text: string): void;
}

const usage = `Usage:
  release bump <project> <auto|major|minor|patch> [--timezone <zone>] [--json]
  release verify <project> [<version>]
  release notes <project> <version> <file>
  release lint <project>
`;

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

        switch (command) {
            case 'bump': {
                const [project, level] = expectArgs(args, 2, 2);
                await bump({ project, level, json: values.json, timeZone: values.timezone }, deps);
                break;
            }
            case 'verify': {
                const [project, version] = expectArgs(args, 1, 2);
                await verify({ project, version }, deps);
                break;
            }
            case 'notes': {
                const [project, version, file] = expectArgs(args, 3, 3);
                await notes({ project, version, file }, deps);
                break;
            }
            case 'lint': {
                const [project] = expectArgs(args, 1, 1);
                await lint({ project }, deps);
                break;
            }
            default:
                throw new UsageError(command === undefined ? 'missing command' : `unknown command ${command}`);
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

/** Checks the number of positional arguments of a command. */
function expectArgs<Min extends number>(args: string[], min: Min, max: number): Arguments<Min> {
    if (args.length < min || args.length > max) {
        const expected = min === max ? String(min) : `${String(min)} to ${String(max)}`;
        throw new UsageError(`expected ${expected} arguments, got ${String(args.length)}`);
    }
    return args as Arguments<Min>;
}

/** The arguments that `expectArgs` returns for a minimum of `Min`: one required and one optional for 1, two required for 2, three required otherwise. */
type Arguments<Min extends number> = Min extends 1
    ? [string, string?]
    : Min extends 2
      ? [string, string]
      : [string, string, string];
