/** The state of the mocked repository, which a test sets with `mockGit`. Each option has a default. */
export interface GitState {
    /** The names of the tags, such as `web@v1.0.0`. Defaults to none. */
    tags?: string[];
}

/** What a command of the mock wrote to standard output and standard error. */
export interface Output {
    /** Everything the command wrote to standard output. */
    stdout: string;
    /** Everything the command wrote to standard error. */
    stderr: string;
}

/**
 * Turns a pattern of `git tag --list` into a regular expression. `*` matches any text, `/` included, and `?` matches
 * one character, as git's wildmatch does for tags. The mock rejects the rest of wildmatch, such as `[a-z]` and `\*`,
 * rather than answer differently from git.
 */
function toRegExp(pattern: string): RegExp {
    if (/[[\\]/.test(pattern)) {
        throw new Error(`the git mock supports only * and ? in a pattern, not ${pattern}`);
    }
    const source = pattern.replace(/[*?$()+.^{|}\]]/g, (character) => {
        if (character === '*') {
            return '.*';
        }
        return character === '?' ? '.' : `\\${character}`;
    });

    return new RegExp(`^${source}$`, 's');
}

/** The repository of the mock, which answers the git commands it supports from the state that `reset` sets. */
export class Repository {
    #tags: string[] = [];

    /** Replaces the state of the repository with `state`. */
    public reset({ tags = [] }: GitState = {}): void {
        const duplicate = tags.find((tag, index) => tags.indexOf(tag) !== index);

        if (duplicate !== undefined) {
            throw new Error(`cannot add the tag ${duplicate} twice, since git holds each tag once`);
        }
        this.#tags = [...tags];
    }

    /** Runs git with `args`, the arguments after `git`, as `execFile` passes them. */
    public run(args: readonly string[]): Output {
        const [command, option, ...patterns] = args;

        if (command === 'tag' && option === '--list') {
            return { stdout: this.#listTags(patterns), stderr: '' };
        }
        throw new Error(`the git mock does not support git ${args.join(' ')}`);
    }

    /** Lists the tags that match any of `patterns`, or every tag without one, sorted by name, one per line. */
    #listTags(patterns: string[]): string {
        const matchers = patterns.map(toRegExp);
        const tags = this.#tags.filter((tag) => matchers.length === 0 || matchers.some((matcher) => matcher.test(tag)));

        // git sorts the names by their bytes, which matches comparing the UTF-16 code units of ASCII names.
        return tags
            .toSorted((a, b) => (a < b ? -1 : 1))
            .map((tag) => `${tag}\n`)
            .join('');
    }
}
