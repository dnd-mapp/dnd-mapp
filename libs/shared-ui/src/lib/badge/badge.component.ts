import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { BadgeCountPipe } from './badge-count.pipe';
import { badgeTypeAttribute, BadgeTypes, DEFAULT_BADGE_TYPE } from './models';

@Component({
    selector: 'dma-badge',
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.large]': 'isLarge()',
    },
    imports: [BadgeCountPipe],
})
export class BadgeComponent {
    public readonly type = input(DEFAULT_BADGE_TYPE, { transform: badgeTypeAttribute });

    public readonly label = input(0, { transform: numberAttribute });

    protected readonly isLarge = computed(() => this.type() === BadgeTypes.LARGE);
}
