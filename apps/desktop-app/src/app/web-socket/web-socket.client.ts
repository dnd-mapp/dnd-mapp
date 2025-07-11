import {
    WebSocketMessage,
    WebSocketMessageData,
    WebSocketMessageType,
    WebSocketMessageTypes,
} from '@dnd-mapp/shared-desktop-app';
import { nanoid } from 'nanoid';
import { RawData, WebSocket } from 'ws';
import { LogService } from '../logging';

export class WebSocketClient {
    private readonly logService = LogService.withContext(`WebSocketClient`);

    private readonly socket: WebSocket;

    public readonly id = nanoid();
    private isAlive = true;

    constructor(socket: WebSocket) {
        clients = [...clients, this];
        this.socket = socket;

        this.setupListeners();
    }

    public async ping() {
        if (!this.isAlive) {
            this.socket.terminate();
            deregisterWebSocketClient(this.id);
            return;
        }
        this.isAlive = false;

        await this.sendMessage({ type: WebSocketMessageTypes.PING, data: { clientId: this.id } });
    }

    public closeConnection() {
        this.socket.close();
    }

    public async sendMessage<MessageType extends WebSocketMessageType, MessageData = WebSocketMessageData<MessageType>>(
        message: WebSocketMessage<MessageType, MessageData>
    ) {
        await this.logService.debug(`Sending message "${message.type}" to client with ID "${this.id}"`);
        this.socket.send(JSON.stringify(message));
    }

    private setupListeners() {
        this.socket.on('error', async (error) => await this.onError(error));
        this.socket.on('close', async () => await this.onClose());
        this.socket.on('message', async (data) => this.onMessage(data));
    }

    private async onError(error: Error) {
        await this.logService.error(`Client with ID "${this.id}" encountered an unexpected error`, error);
    }

    private async onClose() {
        await this.logService.info(`Connection of Client with ID "${this.id}" closed`);
        deregisterWebSocketClient(this.id);
    }

    private async onPing() {
        await this.sendMessage({ type: WebSocketMessageTypes.PONG, data: { clientId: this.id } });
    }

    private onPong() {
        this.isAlive = true;
    }

    private async onMessage(message: RawData) {
        const { type } = JSON.parse(message.toString());
        await this.logService.debug(`Client with ID "${this.id}" received message "${type}"`);

        switch (type) {
            case WebSocketMessageTypes.PONG:
                this.onPong();
                return;

            case WebSocketMessageTypes.PING:
                await this.onPing();
                return;
        }
    }
}

export type WebSocketClients = WebSocketClient[];

let clients: WebSocketClients = [];

export async function registerWebSocketClient(socket: WebSocket) {
    const client = new WebSocketClient(socket);
    await client.sendMessage({ type: WebSocketMessageTypes.ID_ASSIGNMENT, data: { id: client.id } });
}

export function deregisterWebSocketClient(clientId: string) {
    clients = clients.filter(({ id }) => clientId !== id);
}

export function deregisterAllWebSocketClients() {
    clients.forEach((client) => client.closeConnection());
}

export async function pingClients() {
    await Promise.all(clients.map((client) => client.ping()));
}
