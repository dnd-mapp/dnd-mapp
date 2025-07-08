import { Injectable, signal } from '@angular/core';
import { DEFAULT_WEB_SOCKET_PORT, WebSocketMessageTypes } from '@dnd-mapp/desktop-shared';
import { MAX_RETRY_ATTEMPTS, msToS, PING_TIMEOUT, WebSocketClientStatus, WebSocketClientStatuses } from './models';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private webSocketClient: WebSocket;

    public webSocketPort = DEFAULT_WEB_SOCKET_PORT;

    private retryAttempts = 0;

    private reconnectTimeoutId: ReturnType<typeof setTimeout>;
    private pingTimeoutId: ReturnType<typeof setInterval>;
    private isAlive = true;

    private webSocketClientId: string;

    public status = signal<WebSocketClientStatus>(WebSocketClientStatuses.DISCONNECTED);

    public initializeClient() {
        this.connect();
    }

    public stopRetryConnection() {
        if (!this.reconnectTimeoutId) return;
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
    }

    public connect() {
        if (this.status() !== WebSocketClientStatuses.CONNECTING) this.status.set('Connecting');

        const timeoutTime = 1_000 + 1_500 * this.retryAttempts++;

        console.log(`Connecting in ${msToS(timeoutTime)} seconds...`);

        this.reconnectTimeoutId = setTimeout(() => {
            clearTimeout(this.reconnectTimeoutId);

            console.log('Connecting');

            this.webSocketClient = new WebSocket(`wss://localhost.desktop-app.dnd-mapp.net:${DEFAULT_WEB_SOCKET_PORT}`);

            this.webSocketClient.onerror = (event: Event) => this.onWebSocketClientError(event);
            this.webSocketClient.onopen = (event: Event) => this.onWebSocketClientConnected(event);
            this.webSocketClient.onclose = (event: CloseEvent) => this.onWebSocketClientClosed(event);
            this.webSocketClient.onmessage = (message: MessageEvent) => this.onWebSocketClientMessage(message);
        }, timeoutTime);
    }

    private onWebSocketClientError(event: Event) {
        this.status.set('Disconnected');

        console.error('The Web Socket client has encountered an unexpected error', event);
    }

    private onWebSocketClientConnected(event: Event) {
        this.status.set('Connected');
        this.retryAttempts = 0;
        console.log('The Web Socket client has connected', event);

        this.pingTimeoutId = setInterval(() => this.ping(), PING_TIMEOUT);
    }

    private ping() {
        if (!this.isAlive) {
            this.webSocketClient.close(1000);
            return;
        }
        this.isAlive = false;
        this.webSocketClient.send(JSON.stringify({ type: 'ping', data: { clientId: this.webSocketClientId } }));
    }

    private onWebSocketClientClosed(event: CloseEvent) {
        clearInterval(this.pingTimeoutId);
        this.pingTimeoutId = null;

        if (event.code === 1006 && this.retryAttempts < MAX_RETRY_ATTEMPTS) {
            this.connect();
            return;
        }
        this.status.set('Disconnected');

        console.log('The Web Socket client has closed', event);
    }

    private onWebSocketClientMessage(message: MessageEvent) {
        const { type, data } = JSON.parse(message.data);
        console.log('The Web Socket client has received a message', { type, data });

        switch (type) {
            case WebSocketMessageTypes.ID_ASSIGNMENT:
                this.onIdAssignment(data.id);
                return;

            case WebSocketMessageTypes.PING:
                this.onPing();
                return;

            case WebSocketMessageTypes.PONG:
                this.onPong();
                return;
        }
    }

    private onIdAssignment(clientId: string) {
        this.webSocketClientId = clientId;
    }

    private onPing() {
        this.webSocketClient.send(
            JSON.stringify({ type: WebSocketMessageTypes.PONG, data: { clientId: this.webSocketClientId } })
        );
    }

    private onPong() {
        this.isAlive = true;
    }
}
