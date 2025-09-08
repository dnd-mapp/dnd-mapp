import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-music-so-icon, dma-icon[dma-music-so-icon]',
    templateUrl: './music.icon.svg',
    styleUrl: '../../icons.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicSoIcon {}
