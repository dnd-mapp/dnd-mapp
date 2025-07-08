import { WebSocketMessageTypes } from '@dnd-mapp/desktop-shared';
import { ws } from 'msw';
import { nanoid } from 'nanoid';

const mockWebSocketServer = ws.link('wss://localhost.desktop-app.dnd-mapp.net:8888');

export const webSocketHandlers = [
    mockWebSocketServer.addEventListener('connection', ({ client }) => {
        client.id = nanoid();

        mockWebSocketServer.clients.add(client);
        client.send(JSON.stringify({ type: WebSocketMessageTypes.ID_ASSIGNMENT, data: { id: client.id } }));
    }),
];
