import { nanoid } from 'nanoid';
import { RawData, WebSocket } from 'ws';
import { LogService } from '../logging';
import { WebSocketMessageData, WebSocketMessageType, WebSocketMessageTypes } from './models';

export class WebSocketClient {
    private readonly logService = LogService.withContext(`WebSocketClient`);

    private readonly socket: WebSocket;

    public readonly id = nanoid();
    private isAlive = true;

    constructor(socket: WebSocket) {
        this.socket = socket;

        this.setupListeners();
        this.sendMessage(WebSocketMessageTypes.ID_ASSIGNMENT, { id: this.id });
    }

    public ping() {
        if (!this.isAlive) {
            this.socket.terminate();
            deregisterWebSocketClient(this.id);
            return;
        }
        this.isAlive = false;

        this.socket.ping();
    }

    public closeConnection() {
        this.socket.close();
    }

    public sendMessage<MessageType extends WebSocketMessageType, MessageData = WebSocketMessageData<MessageType>>(
        type: MessageType,
        data: MessageData
    ) {
        this.socket.send(JSON.stringify({ type: type, data: data }));
    }

    private setupListeners() {
        this.socket.on('error', async (error) => await this.onError(error));
        this.socket.on('close', async () => await this.onClose());

        this.socket.on('ping', async () => this.onPing());
        this.socket.on('pong', () => this.onPong());
        this.socket.on('message', async (data) => this.onMessage(data));
    }

    private async onError(error: Error) {
        await this.logService.error(`Client with ID "${this.id}" encountered an unexpected error`, error);
    }

    private async onClose() {
        await this.logService.info(`Connection of Client with ID "${this.id}" closed`);
        deregisterWebSocketClient(this.id);
    }

    private onPing() {
        this.socket.pong();
    }

    private onPong() {
        this.isAlive = true;
    }

    private async onMessage(data: RawData) {
        await this.logService.info('Client received message');

        console.log({ data });
    }
}

export type WebSocketClients = WebSocketClient[];

let clients: WebSocketClients = [];

export function registerWebSocketClient(socket: WebSocket) {
    clients = [...clients, new WebSocketClient(socket)];
}

export function deregisterWebSocketClient(clientId: string) {
    clients = clients.filter(({ id }) => clientId !== id);
}

export function deregisterAllWebSocketClients() {
    clients.forEach((client) => client.closeConnection());
}

export function pingClients() {
    clients.forEach((client) => client.ping());
}
