import { STORAGE, StorageKey } from '@/common';
import { ValueProvider } from '@angular/core';

class MockStorage {
    private storage: Partial<Record<StorageKey, string>> = {};

    public getItem(key: StorageKey) {
        const item = this.storage[key];

        if (!item) return null;
        return item;
    }

    public setItem(key: StorageKey, value: string) {
        this.storage[key] = value;
    }

    public removeItem(key: StorageKey) {
        delete this.storage[key];
    }

    public clear() {
        this.storage = {};
    }
}

export const mockStorage: MockStorage = new MockStorage();

export function provideMockStorage(): ValueProvider {
    return {
        provide: STORAGE,
        useValue: mockStorage,
    };
}

export function resetMockStorage() {
    mockStorage.clear();
}
