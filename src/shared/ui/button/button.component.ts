import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { buttonColorAttribute, DEFAULT_BUTTON_COLOR } from './button-colors';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'button[dma-button]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.icon-only]': 'iconButton()',
        '[attr.dma-button]': 'color()',
    },
    imports: [],
})
export class ButtonComponent {
    public readonly color = input(DEFAULT_BUTTON_COLOR, { alias: 'dma-button', transform: buttonColorAttribute });

    public readonly iconButton = input(false, { transform: booleanAttribute });
}
