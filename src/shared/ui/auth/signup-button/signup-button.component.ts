import { TranslateDirective } from '@/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { IconDirective, UserPlusIcon } from '../../icons';
import { TooltipAnchorDirective } from '../../tooltip';

@Component({
    selector: 'dma-signup-button',
    templateUrl: './signup-button.component.html',
    styleUrl: './signup-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, TranslateDirective, UserPlusIcon, IconDirective, TooltipAnchorDirective],
})
export class SignupButtonComponent {
    public readonly iconOnly = input(false);

    protected onSignup() {
        console.warn('SIGN UP');
    }
}
