import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-settings-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class SettingsOverviewPage {}
