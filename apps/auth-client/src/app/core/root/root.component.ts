import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WebSocketStatusComponent } from '../web-socket';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [WebSocketStatusComponent],
})
export class RootComponent {}
