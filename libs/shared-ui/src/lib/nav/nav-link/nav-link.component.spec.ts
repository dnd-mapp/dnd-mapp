import { Component, signal } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { DummyComponent, NavLinkHarness, setupEnvironment } from '@dnd-mapp/shared-ui/test';
import { NavLinkComponent } from './nav-link.component';

describe('NavLinkComponent', () => {
    @Component({
        template: `<dma-nav-link route="/test" [exactMatch]="exactMatch()">Test route</dma-nav-link>`,
        imports: [NavLinkComponent],
    })
    class TestComponent {
        public readonly exactMatch = signal(false);
    }

    const routes: Routes = [
        {
            path: 'test',
            component: DummyComponent,
        },
    ];

    async function setupTest() {
        const { harness } = await setupEnvironment({
            component: TestComponent,
            harness: NavLinkHarness,
            providers: [provideRouter(routes)],
        });

        return {
            harness: harness,
        };
    }

    it('should render', async () => {
        const { harness } = await setupTest();
        expect(harness).toBeDefined();
    });
});
