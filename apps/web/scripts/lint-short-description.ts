// Checks the short description of the web image, which the Push main workflow publishes to Docker Hub. Docker Hub keeps
// at most 100 characters, and peter-evans/dockerhub-description truncates a longer description instead of failing.
import { readFile } from 'node:fs/promises';

// The action truncates at 100 bytes rather than characters, so the check counts the bytes.
const maxBytes = 100;

const path = new URL('../../../.docker/web/short-description.txt', import.meta.url);

// The workflow reads the file through a shell, which drops the final line break.
const description = (await readFile(path, 'utf8')).replace(/\r?\n$/, '');
const bytes = Buffer.byteLength(description, 'utf8');

if (description.trim() === '') {
    throw new Error(`${path.pathname} holds no short description.`);
}
if (/[\r\n]/.test(description)) {
    throw new Error(`Write the short description in ${path.pathname} on a single line.`);
}
if (bytes > maxBytes) {
    throw new Error(
        `The short description in ${path.pathname} is ${String(bytes)} bytes long. Keep it at ${String(maxBytes)} or under.`,
    );
}
