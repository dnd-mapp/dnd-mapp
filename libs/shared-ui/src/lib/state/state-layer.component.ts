import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { StateDirective } from './state.directive';

@Component({
    selector: 'dma-state-layer',
    template: '',
    styleUrl: './state-layer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.opacity]': 'opacity()',
        '[style.background-color]': 'backgroundColor()',
    },
    imports: [],
})
export class StateLayerComponent {
    private readonly stateDirective = inject(StateDirective);

    public readonly color = input.required<string>();

    public readonly disabled = input(false, { transform: booleanAttribute });

    protected readonly opacity = computed(() => (this.disabled() ? 0 : this.stateDirective.opacity() / 100));

    protected readonly backgroundColor = computed(() => `var(--${this.color()})`);
}
