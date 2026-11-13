import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { StorageKey } from './storage.types';
import { InMemoryStorage, provideBrowserStorage, setupTestEnvironment } from '../../testing';

describe('StorageService', () => {
    const key = StorageKey.Theme;

    function setupTest(storage: Storage | null = new InMemoryStorage()) {
        setupTestEnvironment({ providers: [provideBrowserStorage(storage)] });

        return { service: TestBed.inject(StorageService), storage };
    }

    /** Fires the event that the browser fires in this tab when another tab of the site changes a storage. */
    function changeInOtherTab(changedKey: string | null, newValue: string | null, storageArea: Storage = localStorage) {
        window.dispatchEvent(new StorageEvent('storage', { key: changedKey, newValue, storageArea }));
    }

    afterEach(() => {
        localStorage.removeItem(key);
    });

    it('should read null when nothing is saved', () => {
        const { service } = setupTest();

        expect(service.get(key)).toBeNull();
    });

    it('should save, read, and remove a value', () => {
        const { service, storage } = setupTest();

        expect(service.set(key, 'value')).toBe(true);
        expect(service.get(key)).toBe('value');
        expect(storage?.getItem(key)).toBe('value');

        expect(service.remove(key)).toBe(true);
        expect(service.get(key)).toBeNull();
    });

    it('should read and write localStorage by default', () => {
        TestBed.inject(StorageService).set(key, 'value');

        expect(localStorage.getItem(key)).toBe('value');
    });

    describe('when the storage throws', () => {
        it('should read null and report that nothing saved', () => {
            const storage = new InMemoryStorage();
            storage.setItem(key, 'value');
            storage.blocked = true;
            const { service } = setupTest(storage);

            expect(service.get(key)).toBeNull();
            expect(service.set(key, 'other')).toBe(false);
            expect(service.remove(key)).toBe(false);
        });
    });

    describe('without a storage', () => {
        it('should read null and report that nothing saved', () => {
            const { service } = setupTest(null);

            expect(service.get(key)).toBeNull();
            expect(service.set(key, 'value')).toBe(false);
            expect(service.remove(key)).toBe(false);
        });

        it('should not listen for changes in other tabs', () => {
            const { service } = setupTest(null);
            const listener = vi.fn();
            service.watch(key, listener);

            changeInOtherTab(key, 'value');

            expect(listener).not.toHaveBeenCalled();
        });
    });

    // A StorageEvent accepts only a storage of the browser as its storageArea, so these tests use localStorage.
    describe('when another tab changes a key', () => {
        function setupWatch() {
            const { service } = setupTest(localStorage);
            const listener = vi.fn();
            const stop = service.watch(key, listener);

            return { listener, stop };
        }

        it('should pass the new value', () => {
            const { listener } = setupWatch();

            changeInOtherTab(key, 'value');

            expect(listener).toHaveBeenCalledExactlyOnceWith('value');
        });

        it('should pass null when the other tab removes the key', () => {
            const { listener } = setupWatch();

            changeInOtherTab(key, null);

            expect(listener).toHaveBeenCalledExactlyOnceWith(null);
        });

        it('should pass null when the other tab clears the storage', () => {
            const { listener } = setupWatch();

            changeInOtherTab(null, null);

            expect(listener).toHaveBeenCalledExactlyOnceWith(null);
        });

        it('should ignore a change to another key', () => {
            const { listener } = setupWatch();

            changeInOtherTab('other-key', 'value');

            expect(listener).not.toHaveBeenCalled();
        });

        it('should ignore a change to another storage', () => {
            const { listener } = setupWatch();

            changeInOtherTab(key, 'value', sessionStorage);

            expect(listener).not.toHaveBeenCalled();
        });

        it('should stop once the returned function is called', () => {
            const { listener, stop } = setupWatch();

            stop();
            changeInOtherTab(key, 'value');

            expect(listener).not.toHaveBeenCalled();
        });

        it('should stop once the app is destroyed', () => {
            const { listener } = setupWatch();
            TestBed.resetTestingModule();

            changeInOtherTab(key, 'value');

            expect(listener).not.toHaveBeenCalled();
        });
    });
});
