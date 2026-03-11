import { STORAGE, StorageKeys } from '@/common';
import { NavRailHarness, setupTestEnvironment } from '@/test';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavRailComponent } from './nav-rail.component';

describe('NavRailComponent', () => {
    @Component({
        template: `<dma-nav-rail></dma-nav-rail>`,
        imports: [NavRailComponent],
    })
    class TestComponent {}

    interface SetupTestParams {
        initialCollapseState?: boolean;
    }

    async function setupTest(params?: SetupTestParams) {
        const beforeCreateComponent = () => {
            if (params?.initialCollapseState === undefined) return;
            const storage = TestBed.inject(STORAGE);

            storage.setItem(StorageKeys.NAV_RAIL_COLLAPSED, `${params.initialCollapseState}`);
        };

        const { harness } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavRailHarness,
            beforeCreateComponent: beforeCreateComponent,
        });

        return {
            harness: harness!,
            storage: TestBed.inject(STORAGE),
        };
    }

    it('should toggle collapsed state', async () => {
        const { harness, storage } = await setupTest();

        expect(storage.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual(null);
        expect(await harness.isCollapsed()).toEqual(false);

        await harness.toggleCollapse();

        expect(await harness.isCollapsed()).toEqual(true);
        expect(storage.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual('true');
    });

    it('should initialize with collapse state from storage', async () => {
        const { harness, storage } = await setupTest({ initialCollapseState: true });

        expect(await harness.isCollapsed()).toEqual(true);
        expect(storage.getItem(StorageKeys.NAV_RAIL_COLLAPSED)).toEqual('true');
    });
});
