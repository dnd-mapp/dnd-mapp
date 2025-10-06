import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent, OptionComponent, PlusSoIconComponent, SelectComponent } from '@dnd-mapp/shared-ui';
import { from, switchMap } from 'rxjs';
import { resourceOptions } from './resource-options';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import { ResourcesService } from './resources.service';

@Component({
    selector: 'dma-resources-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SelectComponent,
        OptionComponent,
        RouterOutlet,
        ResourcesListComponent,
        ButtonComponent,
        PlusSoIconComponent,
    ],
})
export class OverviewPage {
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    private readonly resourcesService = inject(ResourcesService);

    protected readonly resourceOptions = resourceOptions.map((option) => {
        if (option.value !== this.resourcesService.resourceType()) return option;
        option.selected = true;

        return option;
    });

    constructor() {
        toObservable(this.resourcesService.resourceType)
            .pipe(
                switchMap((resourceType) => from(this.router.navigateByUrl(`/resources/${resourceType}`))),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    protected onSelectResourceType(value: unknown) {
        this.resourcesService.setResourceType(value);
    }

    protected onNewResource() {
        this.resourcesService.createNewResource();
    }
}
