import { DmaDesktopAppEvents } from '@dnd-mapp/shared-desktop-app';
import { ipcMain } from 'electron';
import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { createServer as createHttpsServer, Server as HttpsServer } from 'https';
import { WebSocket, WebSocketServer } from 'ws';
import { ConfigService } from '../config';
import { FileService } from '../file-system';
import { LogService } from '../logging';
import { ENV_NAME_WEB_SOCKET_SERVER_HOST, PING_INTERVAL_TIME, WS_SERVER_HOST } from './models';
import { deregisterAllWebSocketClients, pingClients, registerWebSocketClient } from './web-socket.client';

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
    private configService: ConfigService;

    private webSocketServer: WebSocketServer;
    private server: HttpsServer | HttpServer;

    private webSocketHost = process.env[ENV_NAME_WEB_SOCKET_SERVER_HOST] || WS_SERVER_HOST;
    private webSocketPort: number;

    private pingInterval: NodeJS.Timeout;

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing WebSocketService');

        this.configService = await ConfigService.instance();
        this.webSocketPort = await this.configService.getSetting('webSocketPort');

        await this.configureWebSocketServer();

        this.pingInterval = setInterval(async () => {
            await this.logService.debug('Sending ping to Web Socket clients');
            await pingClients();
        }, PING_INTERVAL_TIME);

        this.setupIpcHandlers();
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

        // TODO: Make host configurable
        this.server.listen(this.webSocketPort, this.webSocketHost, async () => await this.onServerListening());
    }

    private setupIpcHandlers() {
        ipcMain.handle(DmaDesktopAppEvents.WEB_SOCKET_PORT, () => this.webSocketPort);
        ipcMain.handle(
            DmaDesktopAppEvents.UPDATE_WEB_SOCKET_PORT,
            async (_event, webSocketPort: number) => await this.onWebSocketPortUpdated(webSocketPort)
        );
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying WebSocketService');

        this.removeIpcHandlers();

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
        const webSocketServerAddress = `${this.server instanceof HttpsServer ? 'wss' : 'ws'}://${this.webSocketHost}:${this.webSocketPort}/socket`;

        await this.logService.info(`WebSocketServer listening on "${webSocketServerAddress}"`);
    }

    private async onError(error: Error) {
        await this.logService.error('The WebSocketServer experienced an unexpected error', error);
    }

    private async onClose() {
        await this.logService.info('The WebSocketServer has closed');
        deregisterAllWebSocketClients();

        this.webSocketServer.removeListener(
            'connection',
            async (webSocket) => await this.onWebSocketConnection(webSocket)
        );
        this.webSocketServer.removeListener('close', async () => await this.onClose());
        this.webSocketServer.removeListener('error', async (error) => await this.onError(error));

        this.server.close();
    }

    private async onWebSocketConnection(webSocket: WebSocket) {
        await registerWebSocketClient(webSocket);
    }

    private async onWebSocketPortUpdated(webSocketPort: number) {
        // TODO: Handle persisting the change of the Web Socket port, notifying the clients of the change and restart the server
        await this.logService.info(`Updating WebSocketServer to run on port "${webSocketPort}"`);
        console.log({ webSocketPort });
    }

    private removeIpcHandlers() {
        ipcMain.removeHandler(DmaDesktopAppEvents.WEB_SOCKET_PORT);
    }
}
