import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-podcast-so-icon, dma-icon[dma-podcast-so-icon]',
    templateUrl: './podcast.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastSoIcon {}
