import {
    AppTopBarComponent,
    LoginButtonComponent,
    NavRailActionsDirective,
    NavRailBodyDirective,
    NavRailComponent,
    SignupButtonComponent,
} from '@/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../nav/nav.component';

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
        NavComponent,
        AppTopBarComponent,
    ],
})
export class RootComponent {}
