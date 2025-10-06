import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OptionComponent, SelectComponent } from '@dnd-mapp/shared-ui';
import { resourceOptions } from './resource-options';
import { ResourcesService } from './resources.service';

@Component({
    selector: 'dma-resources-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SelectComponent, OptionComponent],
})
export class OverviewPage {
    private readonly resourcesService = inject(ResourcesService);

    protected readonly resourceOptions = resourceOptions.map((option) => {
        if (option.value !== this.resourcesService.resourceType()) return option;
        option.selected = true;

        return option;
    });

    protected onSelectResourceType(value: unknown) {
        this.resourcesService.setResourceType(value);
    }
}
