import { inject, Pipe, PipeTransform } from '@angular/core';
import { ResourcesService } from '../resources.service';

@Pipe({
    name: 'resourceSelected',
    pure: true,
})
export class ResourceSelectedPipe implements PipeTransform {
    private readonly resourcesService = inject(ResourcesService);

    public transform(resourceId: string) {
        return this.resourcesService.resource()?.id === resourceId;
    }
}
