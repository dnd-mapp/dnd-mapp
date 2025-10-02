import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeDirective } from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [],
})
export class RootComponent {}
