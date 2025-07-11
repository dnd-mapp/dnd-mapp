import { booleanAttribute, ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { ButtonComponent, buttonTypeAttribute, ButtonTypes, PenToSquareIcon } from '@dnd-mapp/shared-ui';
import { fn } from 'storybook/test';

@Component({
    selector: 'dma-story',
    templateUrl: './button-story.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, PenToSquareIcon],
})
export class ButtonStoryComponent {
    public readonly label = input('My label');

    public readonly withIcon = input(false, { transform: booleanAttribute });

    public readonly buttonType = input(ButtonTypes.SECONDARY, { transform: buttonTypeAttribute });

    public readonly disabled = input(false, { transform: booleanAttribute });

    public readonly processing = input(false, { transform: booleanAttribute });

    @Input() public click = fn();
}
