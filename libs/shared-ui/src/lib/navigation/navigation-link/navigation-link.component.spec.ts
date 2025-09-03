import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { createTestEnvironment, NavigationLinkHarness } from '@dnd-mapp/shared-ui/test';
import { NavigationLinkComponent } from './navigation-link.component';

describe('NavigationLinkComponent', () => {
    @Component({
        template: `<dma-navigation-link route="/my-link">My Link</dma-navigation-link>`,
        imports: [NavigationLinkComponent],
    })
    class TestComponent {}

    const routes: Routes = [
        {
            path: 'my-link',
            children: [],
        },
    ];

    async function setupTest() {
        const { harness } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: NavigationLinkHarness,
            providers: [provideRouter(routes)],
        });

        return {
            harness: harness,
        };
    }

    it('should set the link', async () => {
        const { harness } = await setupTest();
        const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

        expect(await harness.getRoute()).toBe('/my-link');

        await harness.navigateToRoute();
        expect(routerSpy).toHaveBeenCalled();
    });
});
