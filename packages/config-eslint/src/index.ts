import { globSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Config } from 'eslint/config';
import boundaries from 'eslint-plugin-boundaries';

interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
}

const workspaceRoot = resolve(import.meta.dirname, '../../..');

/**
 * Lists the packages for the whole workspace, such as configs, which stay flat in `packages/<name>`. The modules in
 * `packages/<domain>/<slot>` sit one level deeper, so a pattern alone cannot tell the two apart.
 */
function workspacePackages(): string[] {
    return globSync('packages/*/package.json', { cwd: workspaceRoot }).map((path) =>
        dirname(path).replaceAll('\\', '/'),
    );
}

/** Matches the source of any import other than a `@dnd-mapp` package that the project lists in its `package.json`. */
function undeclaredPackages(projectRoot: string): string {
    const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8')) as PackageJson;
    const declared = Object.keys({
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
    }).filter((name) => name.startsWith('@dnd-mapp/'));

    if (declared.length === 0) {
        return '**';
    }
    // Each package adds its root and its subpaths, such as `@dnd-mapp/core-web/testing`, so the braces always hold at
    // least two patterns.
    return `!{${declared.flatMap((name) => [name, `${name}/**`]).join(',')}}`;
}

/**
 * Enforces the dependency rules between the projects of the workspace, which `CONTRIBUTING.md` describes, on the
 * imports of a project. Pass the folder of the project's ESLint config, which holds its `package.json`.
 */
export function moduleBoundaries(projectRoot: string): Config {
    return {
        files: ['**/*.ts'],
        plugins: { boundaries },
        settings: {
            'boundaries/root-path': workspaceRoot,
            'boundaries/elements': [
                { type: 'tooling', pattern: workspacePackages(), partialMatch: false },
                { type: 'app', pattern: 'apps/*', capture: ['platform'], partialMatch: false },
                { type: 'e2e', pattern: 'e2e/*', capture: ['platform'], partialMatch: false },
                { type: 'module', pattern: 'packages/*/*', capture: ['domain', 'slot'], partialMatch: false },
            ],
            'boundaries/legacy-templates': false,
            // The resolver maps every module to its sources through the shared path aliases, as the projects compile
            // them, whether the project declares the module or not. The path names the resolver, which is a
            // dependency of this package rather than of the project.
            'import/resolver': {
                [fileURLToPath(import.meta.resolve('eslint-import-resolver-typescript'))]: {
                    project: join(workspaceRoot, 'tsconfig.base.json'),
                },
            },
        },
        rules: {
            'boundaries/dependencies': [
                'error',
                {
                    default: 'disallow',
                    message:
                        'The dependency rules in CONTRIBUTING.md forbid this project to import {{ dependency.source }}.',
                    policies: [
                        // An app builds on the core of its platform.
                        {
                            from: { element: { type: 'app' } },
                            allow: {
                                to: {
                                    element: {
                                        type: 'module',
                                        captured: { domain: 'core', slot: '{{ from.element.captured.platform }}' },
                                    },
                                },
                            },
                        },
                        // A module builds on the core of its platform, on the domain package of its own domain, and
                        // on the domain package of core.
                        {
                            from: { element: { type: 'module', captured: { slot: '!domain' } } },
                            allow: {
                                to: [
                                    {
                                        element: {
                                            type: 'module',
                                            captured: { domain: 'core', slot: '{{ from.element.captured.slot }}' },
                                        },
                                    },
                                    {
                                        element: {
                                            type: 'module',
                                            captured: { domain: '{{ from.element.captured.domain }}', slot: 'domain' },
                                        },
                                    },
                                    { element: { type: 'module', captured: { domain: 'core', slot: 'domain' } } },
                                ],
                            },
                        },
                        // The router of core lazy-loads the domain modules of its platform.
                        {
                            from: { element: { type: 'module', captured: { domain: 'core', slot: '!domain' } } },
                            allow: {
                                to: {
                                    element: {
                                        type: 'module',
                                        captured: { slot: '{{ from.element.captured.slot }}' },
                                    },
                                },
                                dependency: { nodeKind: 'dynamic-import' },
                            },
                        },
                        // A domain package builds on other domain packages only.
                        {
                            from: { element: { type: 'module', captured: { slot: 'domain' } } },
                            allow: { to: { element: { type: 'module', captured: { slot: 'domain' } } } },
                        },
                        // Config files, such as this one, import the packages for the whole workspace.
                        {
                            allow: { to: { element: { type: 'tooling' } } },
                        },
                        // The path aliases resolve every module, so the project's package.json has to declare it,
                        // or moon misses the dependency. A relative path into another project matches too.
                        {
                            disallow: { dependency: { source: undeclaredPackages(projectRoot) } },
                            message:
                                'Import {{ dependency.source }} by the name of a package that package.json declares.',
                        },
                    ],
                },
            ],
        },
    };
}
