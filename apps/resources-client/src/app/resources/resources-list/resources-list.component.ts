import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ListItemComponent, OrderedListComponent } from '@dnd-mapp/shared-ui';
import { ResourcesService } from '../resources.service';
import { ResourceSelectedPipe } from './resource-selected.pipe';

@Component({
    selector: 'dma-resources-list',
    templateUrl: './resources-list.component.html',
    styleUrl: './resources-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OrderedListComponent, ListItemComponent, ResourceSelectedPipe],
})
export class ResourcesListComponent {
    protected readonly resourcesService = inject(ResourcesService);

    public readonly emptyCollectionMessage = input<string>();

    protected onSelectResource(resourceId: string) {
        console.log({ resourceId });
    }
}
