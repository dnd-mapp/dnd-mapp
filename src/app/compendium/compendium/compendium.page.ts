import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-compendium',
    templateUrl: './compendium.page.html',
    styleUrl: './compendium.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class CompendiumPage {}
