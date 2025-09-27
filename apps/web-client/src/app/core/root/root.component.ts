import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    ThemeDirective,
} from '../../shared';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
})
export class RootComponent {}
