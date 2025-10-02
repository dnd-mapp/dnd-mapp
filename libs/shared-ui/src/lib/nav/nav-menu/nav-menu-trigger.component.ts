import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ButtonComponent } from '../../button';
import { ChevronDownSoIconComponent, ChevronUpSoIconComponent } from '../../icons';

@Component({
    selector: 'dma-nav-menu-trigger',
    templateUrl: './nav-menu-trigger.component.html',
    styleUrl: './nav-menu-trigger.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, ChevronUpSoIconComponent, ChevronDownSoIconComponent],
})
export class NavMenuTriggerComponent {
    public readonly label = input.required<string>();

    protected readonly isOpen = signal(false);

    protected onMenuToggle() {
        this.isOpen.update((open) => !open);
    }
}
