import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeDirective } from '../../shared';
import { HeaderComponent } from '../header';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [HeaderComponent],
})
export class RootComponent {}
