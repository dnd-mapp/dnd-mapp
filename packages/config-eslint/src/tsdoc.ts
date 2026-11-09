import type { Config } from 'eslint/config';
import jsdoc from 'eslint-plugin-jsdoc';

/**
 * Requires a TSDoc comment on every interface and type alias of the project, exported or not, and on each of their
 * members. Add it after the preset of the project.
 */
export function tsdoc(): Config {
    return {
        files: ['**/*.ts'],
        plugins: { jsdoc },
        rules: {
            'jsdoc/require-jsdoc': [
                'error',
                {
                    // The rule requires a comment on every function declaration by default, which this config leaves
                    // to the project.
                    require: { FunctionDeclaration: false },
                    contexts: [
                        'TSInterfaceDeclaration',
                        'TSTypeAliasDeclaration',
                        // The members of an interface or of a type alias, but not those of an inline type, such as
                        // the type of a cast.
                        ':matches(TSInterfaceBody, TSTypeAliasDeclaration > TSTypeLiteral) > :matches(TSPropertySignature, TSMethodSignature)',
                    ],
                },
            ],
        },
    };
}
