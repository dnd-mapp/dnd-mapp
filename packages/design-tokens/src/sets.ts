/** A group of tokens, keyed by the next segment of their path. */
export interface TokenGroup {
    /** A nested group, or a token with its `$value` and `$type`. */
    [key: string]: TokenGroup | Token;
}

/** A design token in DTCG syntax, as Penpot exports it. */
export interface Token {
    /** The value of the token, which may hold `{alias}` references. */
    $value: unknown;
    /** The type of the token, in the type names of Tokens Studio. */
    $type: string;
    /** The description that Penpot shows next to the token. */
    $description?: string;
}

/** The sets of a token export, keyed by set name, such as `color/dark`. */
export type TokenSets = ReadonlyMap<string, TokenGroup>;

/**
 * Tells whether a node of a token tree is a token rather than a group.
 * @param node - The node to check.
 * @returns Whether the node holds a `$value`.
 */
export function isToken(node: TokenGroup | Token): node is Token {
    return Object.hasOwn(node, '$value');
}

/**
 * Splits a single-file token export of Penpot into its sets. The export keys each set by its name at the top level,
 * next to `$themes` and `$metadata`, which the split leaves out.
 * @param exported - The parsed contents of `tokens.json`.
 * @returns The token tree of each set, in the order of the export.
 */
export function splitSets(exported: Readonly<Record<string, unknown>>): TokenSets {
    return new Map(
        Object.entries(exported)
            .filter(([name]) => !name.startsWith('$'))
            .map(([name, tree]) => [name, tree as TokenGroup]),
    );
}

/**
 * Merges the named sets into one token tree, as Style Dictionary reads it. Merging every set would let a later set,
 * such as `color/light`, overwrite the tokens of an earlier one, such as `color/dark`, so the merge takes only the sets
 * it names, and fails when two of them hold the same token.
 * @param sets - The sets of the export.
 * @param names - The names of the sets to merge.
 * @returns A copy of the tokens of the named sets in one tree.
 */
export function mergeSets(sets: TokenSets, names: readonly string[]): TokenGroup {
    const merged: TokenGroup = {};

    for (const name of names) {
        const set = sets.get(name);

        if (set === undefined) {
            throw new Error(`The token export has no set ${name}.`);
        }
        mergeGroup(merged, set, [], name);
    }
    return merged;
}

function mergeGroup(target: TokenGroup, source: TokenGroup, path: readonly string[], setName: string) {
    for (const [key, node] of Object.entries(source)) {
        const existing = target[key];
        const nodePath = [...path, key];

        if (existing === undefined) {
            target[key] = structuredClone(node);
        } else if (!isToken(existing) && !isToken(node)) {
            mergeGroup(existing, node, nodePath, setName);
        } else {
            throw new Error(`Set ${setName} holds ${nodePath.join('.')}, which an earlier set already holds.`);
        }
    }
}

/** Where a token of the merged tree comes from. */
export interface TokenSource {
    /** The name of the set that holds the token. */
    set: string;
    /** The path of the token in that set, which is shorter than the path searched for an expanded token. */
    path: readonly string[];
}

/**
 * Finds the set that holds a token. An expanded token, such as `typography.h1.fontSize`, comes from the token it
 * expands from, `typography.h1`.
 * @param sets - The sets of the export.
 * @param names - The names of the sets to search.
 * @param path - The path of the token.
 * @returns Where the token comes from, or `undefined` when none of the named sets holds it.
 */
export function findSource(
    sets: TokenSets,
    names: readonly string[],
    path: readonly string[],
): TokenSource | undefined {
    for (const set of names) {
        let node: TokenGroup | Token | undefined = sets.get(set);
        let depth = 0;

        while (node !== undefined && !isToken(node) && depth < path.length) {
            node = node[path[depth] ?? ''];
            depth++;
        }
        if (node !== undefined && isToken(node)) {
            return { set, path: path.slice(0, depth) };
        }
    }
    return undefined;
}
