import { DungeonIcon } from '@/shared-ui';
import { NavLinkHarness, setupTestEnvironment } from '@/test';
import { Component, signal } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { NavLinkComponent } from './nav-link.component';

describe('NavLinkComponent', () => {
    @Component({ template: '' })
    class NoopComponent {}

    @Component({
        template: `
            <dma-nav-link route="/campaigns" [iconOnly]="iconOnly()">
                <dma-icon dma-dungeon-icon />Campaigns
            </dma-nav-link>
        `,
        imports: [NavLinkComponent, DungeonIcon],
    })
    class TestComponent {
        public readonly iconOnly = signal(false);
    }

    const routes: Routes = [{ path: 'campaigns', component: NoopComponent }];

    async function setupTest() {
        const { harness, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: NavLinkHarness,
            providers: [provideRouter(routes)],
        });

        return {
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should only show icon', async () => {
        const { harness, componentInstance } = await setupTest();

        expect(await harness.label()).toEqual('Campaigns');

        componentInstance.iconOnly.set(true);
        expect(await harness.label()).toEqual('');
    });

    it('should set active state', async () => {
        const { harness } = await setupTest();

        expect(await harness.isActive()).toEqual(false);

        await harness.navigate();
        expect(await harness.isActive()).toEqual(true);
    });
});
