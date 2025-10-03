import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OptionComponent, SelectComponent } from '@dnd-mapp/shared-ui';
import { resourceOptions } from './resource-options';

@Component({
    selector: 'dma-resources-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SelectComponent, OptionComponent],
})
export class OverviewPage {
    protected readonly resourceOptions = resourceOptions;
}
