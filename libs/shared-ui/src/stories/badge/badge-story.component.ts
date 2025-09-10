import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { BadgeComponent, badgeTypeAttribute, ThemeDirective } from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './badge-story.component.html',
    styleUrl: './badge-story.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [BadgeComponent],
})
export class BadgeStoryComponent {
    public readonly value = input.required({ transform: numberAttribute });

    public readonly type = input.required({ transform: badgeTypeAttribute });
}
