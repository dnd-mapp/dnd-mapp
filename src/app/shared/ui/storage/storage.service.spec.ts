import { StorageKey, StorageKeys } from '@/common';
import { mockStorage, setupTestEnvironment } from '@/test';
import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
    interface SetupTestParams {
        data: Record<StorageKey, string>;
    }

    async function setupTest(params?: SetupTestParams) {
        if (params?.data) {
            Object.entries(params.data).forEach(([key, value]) => {
                mockStorage.setItem(key as StorageKey, value);
            });
        }
        await setupTestEnvironment();

        return {
            service: TestBed.inject(StorageService),
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
        const { service } = await setupTest({ data: { nav_rail_collapsed: '{ value: ' } });

        expect(mockStorage.getItem('nav_rail_collapsed')).toEqual('{ value: ');

        expect(service.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual(null);
        expect(mockStorage.getItem('nav_rail_collapsed')).toEqual(null);
    });

    it('should set an item', async () => {
        const { service } = await setupTest({ data: { nav_rail_collapsed: 'false' } });

        expect(mockStorage.getItem('nav_rail_collapsed')).toEqual('false');

        service.setItem(StorageKeys.NAV_RAIL_COLLAPSED, true);

        expect(mockStorage.getItem('nav_rail_collapsed')).toEqual('true');
    });

    it('should remove an item', async () => {
        const { service } = await setupTest({ data: { nav_rail_collapsed: 'false' } });

        service.removeItem(StorageKeys.NAV_RAIL_COLLAPSED);

        expect(mockStorage.getItem('nav_rail_collapsed')).toEqual(null);
    });

    it('should clear the storage', async () => {
        const { service } = await setupTest({ data: { nav_rail_collapsed: 'false' } });

        service.clear();

        expect(mockStorage.getItem('nav_rail_collapsed')).toEqual(null);
    });
});
