import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { WebSocketStatusComponent } from '../web-socket';
import { WebSocketService } from '../web-socket/web-socket.service';

@Component({
    selector: 'dma-home',
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [WebSocketStatusComponent],
})
export class HomePage implements OnDestroy {
    private readonly webSocketService = inject(WebSocketService);

    public ngOnDestroy() {
        this.webSocketService.stopRetryConnection();
    }
}
