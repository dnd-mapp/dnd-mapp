export const WebSocketClientStatuses = {
    DISCONNECTED: 'Disconnected',
    CONNECTING: 'Connecting',
    CONNECTED: 'Connected',
} as const;

export type WebSocketClientStatus = (typeof WebSocketClientStatuses)[keyof typeof WebSocketClientStatuses];

export const MAX_RETRY_ATTEMPTS = 10;

export const PING_TIMEOUT = 30_000;

export function msToS(ms: number) {
    return ms / 1_000;
}
