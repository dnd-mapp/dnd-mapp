import { LoginButtonComponent, SignupButtonComponent } from '@/auth-ui';
import { TranslateDirective } from '@/common';
import {
    AppTopBarComponent,
    BookOpenIcon,
    DungeonIcon,
    LeadingIconDirective,
    NavLinkComponent,
    NavRailActionsDirective,
    NavRailBodyDirective,
    NavRailComponent,
    TooltipAnchorDirective,
    UsersIcon,
} from '@/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterOutlet,
        NavRailComponent,
        NavRailActionsDirective,
        LoginButtonComponent,
        SignupButtonComponent,
        NavRailBodyDirective,
        NavLinkComponent,
        UsersIcon,
        DungeonIcon,
        BookOpenIcon,
        LeadingIconDirective,
        TranslateDirective,
        TooltipAnchorDirective,
        AppTopBarComponent,
    ],
})
export class RootComponent {}
