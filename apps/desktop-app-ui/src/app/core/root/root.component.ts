import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../top-bar';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, TopBarComponent],
})
export class RootComponent {}
