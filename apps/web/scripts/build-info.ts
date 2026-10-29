// Stamps the commit and version of a build into build-info.json in the output of web:build. The file starts as a copy
// of public/build-info.json, whose placeholder values the dev server serves as they are.
import { readFile, writeFile } from 'node:fs/promises';

// The environment variable that holds the value of each field.
const variables = { commit: 'COMMIT_SHA', version: 'VERSION' };

const path = new URL('../dist/web/browser/build-info.json', import.meta.url);
const buildInfo: unknown = JSON.parse(await readFile(path, 'utf8'));

if (typeof buildInfo !== 'object' || buildInfo === null) {
    throw new Error(`${path.pathname} holds no JSON object.`);
}
const values: Record<string, string> = {};

for (const [field, variable] of Object.entries(variables)) {
    const value = process.env[variable];

    if (!value) {
        throw new Error(`Set ${variable} to the ${field} of the build.`);
    }
    // Fail on a renamed field rather than add one that nothing reads.
    if (!(field in buildInfo)) {
        throw new Error(`${path.pathname} has no ${field} field to stamp.`);
    }
    values[field] = value;
}

await writeFile(path, `${JSON.stringify({ ...buildInfo, ...values })}\n`);
