import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'dma-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrl: './top-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
})
export class TopBarComponent {}
