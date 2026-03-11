import { STORAGE, StorageKey, StorageKeys } from '@/common';
import { setupTestEnvironment } from '@/test';
import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
    interface SetupTestParams {
        data: Record<StorageKey, string>;
    }

    async function setupTest(params?: SetupTestParams) {
        const beforeCreateComponent = () => {
            if (!params?.data) return;
            const storage = TestBed.inject(STORAGE);

            Object.entries(params.data).forEach(([key, value]) => {
                storage.setItem(key as StorageKey, value);
            });
        };

        await setupTestEnvironment({ beforeCreateComponent: beforeCreateComponent });

        return {
            service: TestBed.inject(StorageService),
            storage: TestBed.inject(STORAGE),
        };
    }

    it('should get an item', async () => {
        const { service } = await setupTest({ data: { nav_rail_collapsed: 'false' } });
        expect(service.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual(false);
    });

    it('should return `null` when item is not set', async () => {
        const { service } = await setupTest();
        expect(service.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual(null);
    });

    it('should return `null` when unable to parse item and remove stored value', async () => {
        const { service, storage } = await setupTest({ data: { nav_rail_collapsed: '{ value: ' } });

        expect(storage.getItem('nav_rail_collapsed')).toEqual('{ value: ');

        expect(service.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual(null);
        expect(storage.getItem('nav_rail_collapsed')).toEqual(null);
    });

    it('should set an item', async () => {
        const { service, storage } = await setupTest({ data: { nav_rail_collapsed: 'false' } });

        expect(storage.getItem('nav_rail_collapsed')).toEqual('false');

        service.setItem(StorageKeys.NAV_RAIL_COLLAPSED, true);

        expect(storage.getItem('nav_rail_collapsed')).toEqual('true');
    });

    it('should remove an item', async () => {
        const { service, storage } = await setupTest({ data: { nav_rail_collapsed: 'false' } });

        service.removeItem(StorageKeys.NAV_RAIL_COLLAPSED);

        expect(storage.getItem('nav_rail_collapsed')).toEqual(null);
    });

    it('should clear the storage', async () => {
        const { service, storage } = await setupTest({ data: { nav_rail_collapsed: 'false' } });

        service.clear();

        expect(storage.getItem('nav_rail_collapsed')).toEqual(null);
    });
});
