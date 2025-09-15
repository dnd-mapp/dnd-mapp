import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
    ButtonComponent,
    ButtonGroupComponent,
    buttonSizeAttribute,
    DEFAULT_BUTTON_SIZE,
    ThemeDirective,
} from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './button-group-story.component.html',
    styleUrl: './button-group-story.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [ButtonGroupComponent, ButtonComponent],
})
export class ButtonGroupStoryComponent {
    public readonly size = input(DEFAULT_BUTTON_SIZE, { transform: buttonSizeAttribute });

    public readonly options = input([]);
}
