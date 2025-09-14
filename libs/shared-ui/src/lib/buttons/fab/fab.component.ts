import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StateDirective, StateLayerComponent } from '@dnd-mapp/shared-ui';
import { DEFAULT_FAB_COLOR, DEFAULT_FAB_SIZE, fabColorAttribute, FabColors, fabSizeAttribute } from './models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[dmaFab]',
    templateUrl: './fab.component.html',
    styleUrl: './fab.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [StateDirective],
    host: {
        '[attr.dma-fab]': 'color()',
        '[attr.dma-fab-size]': 'size()',
        '[class.floating]': 'floating()',
        '[class.above-nav-bar]': 'navigationBarShown()',
    },
    imports: [StateLayerComponent],
})
export class FabComponent {
    public readonly color = input(DEFAULT_FAB_COLOR, { transform: fabColorAttribute, alias: 'dmaFab' });

    // eslint-disable-next-line @angular-eslint/no-input-rename
    public readonly size = input(DEFAULT_FAB_SIZE, { transform: fabSizeAttribute, alias: 'dmaFabSize' });

    public readonly floating = input(false, { transform: booleanAttribute });

    public readonly navigationBarShown = input(false, { transform: booleanAttribute });

    protected readonly stateColor = computed(() => this.getStateColor(this.color()));

    private getStateColor(color: string) {
        switch (color) {
            case FabColors.TONAL_SECONDARY:
                return 'on-secondary-container';

            case FabColors.TONAL_TERTIARY:
                return 'on-tertiary-container';

            case FabColors.PRIMARY:
                return 'on-primary';

            case FabColors.SECONDARY:
                return 'on-secondary';

            case FabColors.TERTIARY:
                return 'on-tertiary';

            default:
                return 'on-primary-container';
        }
    }
}
