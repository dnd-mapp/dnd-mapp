import { TranslateDirective } from '@/common';
import {
    BookOpenIcon,
    DungeonIcon,
    LeadingIconDirective,
    NavLinkComponent,
    TooltipAnchorDirective,
    UsersIcon,
} from '@/shared-ui';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'dma-nav',
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        BookOpenIcon,
        DungeonIcon,
        LeadingIconDirective,
        NavLinkComponent,
        UsersIcon,
        TranslateDirective,
        TooltipAnchorDirective,
    ],
})
export class NavComponent {
    public readonly isCollapsed = input(false);
}
