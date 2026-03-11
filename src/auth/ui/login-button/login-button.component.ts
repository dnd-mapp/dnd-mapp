import { TranslateDirective } from '@/common';
import { ArrowRightToBracketIcon, ButtonComponent, IconDirective } from '@/shared-ui';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'dma-login-button',
    templateUrl: './login-button.component.html',
    styleUrl: './login-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, TranslateDirective, ArrowRightToBracketIcon, IconDirective],
})
export class LoginButtonComponent {
    public readonly iconOnly = input(false);

    protected onLogin() {
        console.warn('LOG IN');
    }
}
