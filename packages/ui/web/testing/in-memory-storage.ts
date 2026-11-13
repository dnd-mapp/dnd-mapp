/**
 * A `Storage` that keeps its values in memory, so a test can provide it as `BROWSER_STORAGE` without touching the
 * storage of the browser or the other tests. The browser accepts only its own storage in a `StorageEvent`, so a test
 * of a change in another tab still needs `localStorage`.
 */
export class InMemoryStorage implements Storage {
    /** Makes every member throw the `SecurityError` that a browser throws when it blocks storage for the site. */
    public blocked = false;

    private readonly values = new Map<string, string>();

    public get length(): number {
        this.assertAllowed();
        return this.values.size;
    }

    public clear(): void {
        this.assertAllowed();
        this.values.clear();
    }

    public getItem(key: string): string | null {
        this.assertAllowed();
        return this.values.get(key) ?? null;
    }

    public key(index: number): string | null {
        this.assertAllowed();
        return [...this.values.keys()][index] ?? null;
    }

    public removeItem(key: string): void {
        this.assertAllowed();
        this.values.delete(key);
    }

    public setItem(key: string, value: string): void {
        this.assertAllowed();
        this.values.set(key, value);
    }

    private assertAllowed() {
        if (this.blocked) {
            throw new DOMException('The browser blocks storage for this site.', 'SecurityError');
        }
    }
}
