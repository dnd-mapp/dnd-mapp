import { computed, Injectable, signal } from '@angular/core';
import { ResourceEntity } from '@dnd-mapp/shared';
import { ResourceBuilder } from './models/resource.builder';
import { ResourceType, resourceTypeAttribute, ResourceTypes } from './resource-options';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
    public readonly resourceType = signal<ResourceType>(ResourceTypes.SPELLS);

    public readonly resources = signal<ResourceEntity[]>([]);

    public readonly resource = signal<ResourceEntity>(null);

    public readonly hasNonexistingResourceSelected = computed(
        () => this.hasResourceSelected() && this.resource().id === null,
    );

    public readonly hasResourceSelected = computed(() => this.resource() !== null);

    public setResourceType(value: unknown) {
        this.resourceType.set(resourceTypeAttribute(value));
    }

    public createNewResource() {
        this.resources.update((resources) => [new ResourceBuilder().build(), ...resources]);
    }
}
