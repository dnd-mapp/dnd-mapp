/**
 * A `Storage` that keeps its values in memory, so a test can provide it as `BROWSER_STORAGE` without touching the
 * storage of the browser or the other tests. The browser accepts only its own storage in a `StorageEvent`, so a test
 * of a change in another tab still needs `localStorage`.
 */
export class InMemoryStorage implements Storage {
    [name: string]: unknown;

    private readonly values = new Map<string, string>();

    public get length(): number {
        return this.values.size;
    }

    public clear(): void {
        this.values.clear();
    }

    public getItem(key: string): string | null {
        return this.values.get(key) ?? null;
    }

    public key(index: number): string | null {
        return [...this.values.keys()][index] ?? null;
    }

    public removeItem(key: string): void {
        this.values.delete(key);
    }

    public setItem(key: string, value: string): void {
        this.values.set(key, value);
    }
}
