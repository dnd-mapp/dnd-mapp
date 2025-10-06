import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'dma-list-item',
    templateUrl: './list-item.component.html',
    styleUrl: './list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.active]': 'active()',
    },
    imports: [],
})
export class ListItemComponent {
    public readonly active = input(false, { transform: booleanAttribute });
}
