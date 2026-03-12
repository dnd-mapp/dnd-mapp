import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'dma-tooltip',
    template: `{{ label() }}`,
    styleUrl: './tooltip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'animate.enter': 'fade-in',
        'animate.leave': 'fade-out',
    },
    imports: [],
})
export class TooltipComponent {
    public readonly label = input.required<string>();
}
