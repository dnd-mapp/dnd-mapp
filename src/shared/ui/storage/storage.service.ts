import { STORAGE, StorageKey } from '@/common';
import { inject, Injectable } from '@angular/core';
import { tryCatchSync } from '@dnd-mapp/shared-utils';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private readonly storage = inject(STORAGE);

    public getItem<T>(key: StorageKey) {
        const stored = this.storage.getItem(key);

        if (!stored) return null;
        const { data: parsed, error } = tryCatchSync(() => JSON.parse(stored) as T);

        if (error) {
            this.removeItem(key);
            return null;
        }
        return parsed;
    }

    public setItem(key: StorageKey, value: unknown) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    public removeItem(key: string) {
        this.storage.removeItem(key);
    }

    public clear() {
        this.storage.clear();
    }
}
