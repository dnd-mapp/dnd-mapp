import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AngleLeftIcon, AngleRightIcon } from '../../../icons/solid';

@Component({
    selector: 'dma-nav-rail-toggle',
    templateUrl: './nav-rail-toggle.component.html',
    styleUrl: './nav-rail-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(click)': 'onToggle()',
    },
    imports: [AngleRightIcon, AngleLeftIcon],
})
export class NavRailToggleComponent {
    public readonly collapsed = input.required<boolean>();

    public readonly toggleNavRail = output<boolean>();

    protected onToggle() {
        this.toggleNavRail.emit(!this.collapsed());
    }
}
