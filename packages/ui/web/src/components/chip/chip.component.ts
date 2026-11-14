import { Component, input } from '@angular/core';
import { chipKindAttr, DEFAULT_CHIP_KIND } from './chip.types';

/**
 * A label for a status, role, tag, or condition. It is not a control, so it takes no focus and emits nothing. Its
 * projected text carries the meaning, so color is never the only cue.
 */
@Component({
    selector: 'dma-chip',
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    host: {
        '[class.status]': "kind() === 'status'",
        '[class.dm]': "kind() === 'dm'",
    },
})
export class ChipComponent {
    public readonly kind = input(DEFAULT_CHIP_KIND, { transform: chipKindAttr });
}
