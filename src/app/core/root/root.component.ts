import { LoginButtonComponent, SignupButtonComponent } from '@/auth-ui';
import { NavRailActionsDirective, NavRailComponent } from '@/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, NavRailComponent, NavRailActionsDirective, LoginButtonComponent, SignupButtonComponent],
})
export class RootComponent {}
