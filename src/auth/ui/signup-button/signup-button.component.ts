import { TranslateDirective } from '@/common';
import { ButtonComponent, IconDirective, UserPlusIcon } from '@/shared-ui';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'dma-signup-button',
    templateUrl: './signup-button.component.html',
    styleUrl: './signup-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, TranslateDirective, UserPlusIcon, IconDirective],
})
export class SignupButtonComponent {
    public readonly iconOnly = input(false);

    protected onSignup() {
        console.warn('SIGN UP');
    }
}
