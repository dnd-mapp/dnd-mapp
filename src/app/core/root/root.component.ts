import { LoginButtonComponent, SignupButtonComponent } from '@/auth-ui';
import { TranslateDirective } from '@/common';
import {
    BookOpenIcon,
    DungeonIcon,
    LeadingIconDirective,
    NavLinkComponent,
    NavRailActionsDirective,
    NavRailBodyDirective,
    NavRailComponent,
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
    ],
})
export class RootComponent {}
