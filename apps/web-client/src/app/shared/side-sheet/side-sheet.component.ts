import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';
import { ThemeDirective } from '../theming';

@Component({
    selector: 'dma-side-sheet',
    templateUrl: './side-sheet.component.html',
    styleUrl: './side-sheet.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [CdkPortalOutlet],
})
export class SideSheetComponent<T> {
    public readonly component = input<Type<T>>(null);

    protected readonly hasComponent = computed(() => this.component() !== null);

    protected readonly componentPortal = computed(() => new ComponentPortal(this.component()));
}
