import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { WebSocketStatusComponent } from '../web-socket';
import { WebSocketService } from '../web-socket/web-socket.service';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [WebSocketStatusComponent],
})
export class RootComponent implements OnDestroy {
    private readonly webSocketService = inject(WebSocketService);

    public ngOnDestroy() {
        this.webSocketService.stopRetryConnection();
    }
}
