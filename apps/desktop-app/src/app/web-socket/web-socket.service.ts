import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { createServer as createHttpsServer, Server as HttpsServer } from 'https';
import { WebSocket, WebSocketServer } from 'ws';
import { FileService } from '../file-system';
import { LogService } from '../logging';
import { deregisterAllWebSocketClients, pingClients, registerWebSocketClient } from './web-socket.client';

const PING_INTERVAL_TIME = 30_000 as const;

const WS_SERVER_PORT = 8888 as const;
const WS_SERVER_HOST = 'localhost.desktop-app.dnd-mapp.net' as const;

export class WebSocketService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new WebSocketService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: WebSocketService;

    private readonly fileService = FileService.instance();
    private logService = LogService.withContext('WebSocketService');

    private webSocketServer: WebSocketServer;
    private server: HttpsServer | HttpServer;

    private pingInterval: NodeJS.Timeout;

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing WebSocketService');

        await this.configureWebSocketServer();
    }

    private async configureWebSocketServer() {
        this.server = await this.getWebSocketServerInstance();

        this.webSocketServer = new WebSocketServer({
            autoPong: false,
            clientTracking: false,
            server: this.server,
        });

        this.webSocketServer.on('error', async (error) => await this.onError(error));
        this.webSocketServer.on('close', async () => await this.onClose());
        this.webSocketServer.on('connection', (webSocket) => this.onWebSocketConnection(webSocket));

        this.pingInterval = setInterval(() => pingClients(), PING_INTERVAL_TIME);

        // TODO: Make host and port configurable
        this.server.listen(WS_SERVER_PORT, WS_SERVER_HOST, async () => await this.onServerListening());
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying WebSocketService');

        clearInterval(this.pingInterval);
        this.pingInterval = null;

        this.webSocketServer.close();

        WebSocketService._instance = null;
        return null;
    }

    private async getWebSocketServerInstance() {
        const sslCertificate = await this.fileService.readFileText('certificate.pem');

        if (!sslCertificate) return createHttpServer();
        return createHttpsServer({
            cert: sslCertificate,
            key: await this.fileService.readFileText('certificate-key.pem'),
        });
    }

    private async onServerListening() {
        const webSocketServerAddress = `${this.server instanceof HttpsServer ? 'wss' : 'ws'}://${WS_SERVER_HOST}:${WS_SERVER_PORT}/socket`;

        await this.logService.info(`WebSocketServer listening on "${webSocketServerAddress}"`);
    }

    private async onError(error: Error) {
        await this.logService.error('The WebSocketServer experienced an unexpected error', error);
    }

    private async onClose() {
        await this.logService.info('The WebSocketServer has closed');
        deregisterAllWebSocketClients();

        this.webSocketServer.removeListener('connection', (webSocket) => this.onWebSocketConnection(webSocket));
        this.webSocketServer.removeListener('close', async () => await this.onClose());
        this.webSocketServer.removeListener('error', async (error) => await this.onError(error));

        this.server.close();
    }

    private onWebSocketConnection(webSocket: WebSocket) {
        registerWebSocketClient(webSocket);
    }
}
