import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-roles-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class RolesOverviewPage {}
