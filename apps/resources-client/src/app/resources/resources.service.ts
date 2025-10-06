import { Injectable, signal } from '@angular/core';
import { ResourceType, resourceTypeAttribute, ResourceTypes } from './resource-options';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
    public readonly resourceType = signal<ResourceType>(ResourceTypes.SPELLS);

    public setResourceType(value: unknown) {
        this.resourceType.set(resourceTypeAttribute(value));
    }
}
