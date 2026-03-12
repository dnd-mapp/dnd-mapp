import { DungeonIcon } from '@/shared-ui';
import { setupTestEnvironment, TooltipAnchorHarness } from '@/test';
import { Component, signal } from '@angular/core';
import { firstValueFrom, timer } from 'rxjs';
import { TooltipAnchorDirective } from './tooltip-anchor.directive';

describe('TooltipDirective', () => {
    @Component({
        template: `<dma-icon dma-dungeon-icon [dmaTooltipAnchor]="tooltip()" [tooltipDisabled]="tooltipDisabled()" />`,
        imports: [DungeonIcon, TooltipAnchorDirective],
    })
    class TestComponent {
        public readonly tooltipDisabled = signal(false);

        public readonly tooltip = signal('Campaigns');
    }

    async function setupTest() {
        const { fixture, harness, componentInstance } = await setupTestEnvironment({
            testComponent: TestComponent,
            harness: TooltipAnchorHarness,
        });

        return {
            fixture: fixture!,
            harness: harness!,
            componentInstance: componentInstance!,
        };
    }

    it('should show and hide tooltip', async () => {
        const { harness } = await setupTest();

        expect(await harness.tooltipPresent()).toEqual(false);

        await harness.hover();
        await firstValueFrom(timer(0));

        expect(await harness.tooltipPresent()).toEqual(true);
        expect(await harness.tooltipVisible()).toEqual(true);

        await harness.mouseAway();
        await firstValueFrom(timer(0));

        expect(await harness.tooltipVisible()).toEqual(false);

        await firstValueFrom(timer(0));

        expect(await harness.tooltipPresent()).toEqual(false);
    });

    it('should update the tooltip label while it is shown', async () => {
        const { harness, componentInstance } = await setupTest();

        await harness.hover();
        await firstValueFrom(timer(0));

        expect(await harness.tooltipPresent()).toEqual(true);
        expect(await harness.tooltipLabel()).toEqual('Campaigns');

        componentInstance.tooltip.set('Characters');

        expect(await harness.tooltipLabel()).toEqual('Characters');
    });

    it('should no show the tooltip when it is disabled', async () => {
        const { harness, componentInstance } = await setupTest();

        componentInstance.tooltipDisabled.set(true);

        expect(await harness.tooltipPresent()).toEqual(false);

        await harness.hover();
        await firstValueFrom(timer(0));

        expect(await harness.tooltipPresent()).toEqual(false);
    });
});
