import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAX_WEB_SOCKET_PORT, MIN_WEB_SOCKET_PORT } from '@dnd-mapp/shared-desktop-app';
import { WebSocketClientStatuses } from './models';
import { WebSocketService } from './web-socket.service';

@Component({
    selector: 'dma-web-socket-status',
    templateUrl: './web-socket-status.component.html',
    styleUrl: './web-socket-status.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, NgClass],
})
export class WebSocketStatusComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly webSocketService = inject(WebSocketService);

    protected readonly form = this.formBuilder.group({
        webSocketPort: this.formBuilder.control(this.webSocketService.webSocketPort, [
            Validators.required,
            Validators.min(MIN_WEB_SOCKET_PORT),
            Validators.max(MAX_WEB_SOCKET_PORT),
        ]),
    });

    protected readonly borderColor = computed(() => {
        switch (this.webSocketService.status()) {
            case WebSocketClientStatuses.CONNECTED:
                return 'border-success';

            case WebSocketClientStatuses.DISCONNECTED:
                return 'border-danger';

            case WebSocketClientStatuses.CONNECTING:
            default:
                return 'border-warning';
        }
    });

    protected readonly isConnected = computed(
        () => this.webSocketService.status() === WebSocketClientStatuses.CONNECTED
    );

    public ngOnInit() {
        this.webSocketService.initializeClient();
    }

    protected onConnect() {
        this.webSocketService.connect();
    }
}
