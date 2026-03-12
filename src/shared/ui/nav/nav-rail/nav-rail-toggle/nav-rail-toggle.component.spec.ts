import { NavRailToggleHarness, setupTestEnvironment } from '@/test';
import { Component, signal } from '@angular/core';
import { NavRailToggleComponent } from './nav-rail-toggle.component';

describe('NavRailToggleComponent', () => {
    @Component({
        template: `<dma-nav-rail-toggle [collapsed]="collapsed()" (toggleNavRail)="onToggle($event)" />`,
        imports: [NavRailToggleComponent],
    })
    class TestComponent {
        public readonly collapsed = signal<boolean>(true);

        public hasToggled = false;

        protected onToggle(collapsed: boolean) {
            this.collapsed.set(collapsed);
            this.hasToggled = true;
        }
    }

    async function setupTest() {
        const { harness, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavRailToggleHarness,
        });

        return {
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should reflect collapsed state', async () => {
        const { harness, componentInstance } = await setupTest();

        expect(await harness.isCollapsed()).toEqual(true);
        expect(await harness.isExpanded()).toEqual(false);
        expect(componentInstance.hasToggled).toEqual(false);

        await harness.toggle();

        expect(componentInstance.hasToggled).toEqual(true);
        expect(await harness.isCollapsed()).toEqual(false);
        expect(await harness.isExpanded()).toEqual(true);
    });
});
