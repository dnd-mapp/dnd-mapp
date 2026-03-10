import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-campaigns-overview',
    templateUrl: './campaigns-overview.page.html',
    styleUrl: './campaigns-overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class CampaignsOverviewPage {}
