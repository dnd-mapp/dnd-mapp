import { TranslateDirective } from '@/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { ArrowRightToBracketIcon, IconDirective } from '../../icons';
import { TooltipAnchorDirective } from '../../tooltip';

@Component({
    selector: 'dma-login-button',
    templateUrl: './login-button.component.html',
    styleUrl: './login-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, TranslateDirective, ArrowRightToBracketIcon, IconDirective, TooltipAnchorDirective],
})
export class LoginButtonComponent {
    public readonly iconOnly = input(false);

    protected onLogin() {
        console.warn('LOG IN');
    }
}
