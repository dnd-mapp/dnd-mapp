import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { buttonTypeAttribute, DEFAULT_BUTTON_TYPE } from './models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[dmaButton]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    host: {
        '[attr.dma-button-type]': 'type()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ButtonComponent {
    public readonly type = input(DEFAULT_BUTTON_TYPE, { alias: 'dmaButton', transform: buttonTypeAttribute });
}
