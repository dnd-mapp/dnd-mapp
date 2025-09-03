import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent, buttonTypeAttribute, PlusIcon, ThemeDirective } from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-button-story',
    templateUrl: './button-story.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [ButtonComponent, PlusIcon],
})
export class ButtonStoryComponent {
    public readonly label = input.required<string>();

    public readonly buttonType = input.required({ transform: buttonTypeAttribute });

    public readonly disabled = input(false, { transform: booleanAttribute });

    public readonly processing = input(false, { transform: booleanAttribute });

    public readonly withLeadingIcon = input(false, { transform: booleanAttribute });

    public readonly clicked = output<void>();

    protected onClick() {
        this.clicked.emit();
    }
}
