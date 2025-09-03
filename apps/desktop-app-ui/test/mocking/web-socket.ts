import { DEFAULT_WEB_SOCKET_PORT } from '@dnd-mapp/shared-desktop-app';

let mockWebSocketPort = DEFAULT_WEB_SOCKET_PORT;

export function getWebSocketPort() {
    return mockWebSocketPort;
}

export function setWebSocketPort(port: number) {
    mockWebSocketPort = port;
}

export function resetWebSocketPort() {
    mockWebSocketPort = DEFAULT_WEB_SOCKET_PORT;
}
