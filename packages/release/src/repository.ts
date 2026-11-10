/**
 * Turns the `repository` field of a `package.json` into the web URL of the repository, such as
 * `https://github.com/dnd-mapp/dnd-mapp`, or returns `undefined` when the field names no repository it can link to.
 * The field takes a URL, as a string or as the `url` of an object, or the `github:` shorthand, with or without its
 * prefix, as npm reads it.
 */
export function repositoryUrl(field: unknown): string | undefined {
    const value = typeof field === 'object' && field !== null && 'url' in field ? field.url : field;

    if (typeof value !== 'string') {
        return undefined;
    }
    const shorthand = /^(?:github:)?([\w.-]+\/[\w.-]+)$/.exec(value.trim());

    if (shorthand) {
        return `https://github.com/${withoutGitSuffix(shorthand[1] ?? '')}`;
    }
    return webUrlOf(value.trim());
}

/** The `https` URL of a git remote, which takes `git+`, `git`, `ssh`, `http`, and `https` URLs, and the scp-like syntax of git. */
function webUrlOf(remote: string): string | undefined {
    // git reads user@host:path as an SSH remote; rewrite it to a URL before parsing. The host needs a dot, so the
    // gitlab: and bitbucket: shorthands of npm, whose links differ from those of GitHub, stay unsupported.
    const scp = /^([\w.-]+@)?([\w-]+(?:\.[\w-]+)+):(?!\/\/)(.+)$/.exec(remote);
    const text = scp ? `ssh://${scp[1] ?? ''}${scp[2] ?? ''}/${scp[3] ?? ''}` : remote.replace(/^git\+/, '');

    if (!URL.canParse(text)) {
        return undefined;
    }
    const url = new URL(text);
    const path = withoutGitSuffix(url.pathname.replace(/^\/+|\/+$/g, ''));

    if (!['git:', 'ssh:', 'http:', 'https:'].includes(url.protocol) || url.hostname === '' || !path.includes('/')) {
        return undefined;
    }
    return `https://${url.hostname}/${path}`;
}

function withoutGitSuffix(path: string): string {
    return path.replace(/\.git$/, '');
}
