import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { tryCatchSync } from '@dnd-mapp/common';
import { BROWSER_STORAGE } from './storage.token';

/** Receives the new value of a key that another tab changed, or `null` when that tab removed it. */
export type StorageListener = (value: string | null) => void;

/**
 * Reads and writes the storage that `BROWSER_STORAGE` provides. Storage can fail when the browser blocks it for the
 * site or it is full, so no method throws: a read returns `null`, and a write returns whether it saved.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
    private readonly storage = inject(BROWSER_STORAGE);
    private readonly view = inject(DOCUMENT).defaultView;
    private readonly watchers = new Set<{ key: string; listener: StorageListener }>();

    /** Passes a change that another tab made to the watchers of its key. A `null` key means that tab cleared it all. */
    private readonly onStorage = (event: StorageEvent) => {
        if (event.storageArea !== this.storage) {
            return;
        }
        for (const { key, listener } of this.watchers) {
            if (event.key === null || event.key === key) {
                listener(event.key === null ? null : event.newValue);
            }
        }
    };

    constructor() {
        if (!this.storage) {
            return;
        }
        this.view?.addEventListener('storage', this.onStorage);
        inject(DestroyRef).onDestroy(() => this.view?.removeEventListener('storage', this.onStorage));
    }

    /** The value saved under `key`, or `null` when there is none or the storage can't be read. */
    public get(key: string): string | null {
        const storage = this.storage;
        const read = tryCatchSync(() => storage?.getItem(key) ?? null);

        return read.ok ? read.value : null;
    }

    /** Saves `value` under `key`, and returns whether it saved. */
    public set(key: string, value: string): boolean {
        return this.write((storage) => {
            storage.setItem(key, value);
        });
    }

    /** Removes the value saved under `key`, and returns whether it did. */
    public remove(key: string): boolean {
        return this.write((storage) => {
            storage.removeItem(key);
        });
    }

    /**
     * Calls `listener` each time another tab of the site changes `key`, until the app is destroyed or the returned
     * function stops it. The browser tells a tab about the changes of other tabs only, never about its own.
     */
    public watch(key: string, listener: StorageListener): () => void {
        const watcher = { key, listener };

        this.watchers.add(watcher);
        return () => {
            this.watchers.delete(watcher);
        };
    }

    /** Runs `change` on the storage, and returns whether it ran without throwing. */
    private write(change: (storage: Storage) => void) {
        const storage = this.storage;

        return (
            storage !== null &&
            tryCatchSync(() => {
                change(storage);
            }).ok
        );
    }
}
