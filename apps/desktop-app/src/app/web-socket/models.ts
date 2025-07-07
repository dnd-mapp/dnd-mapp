export const PING_INTERVAL_TIME = 30_000 as const;

export const WS_SERVER_HOST = 'localhost.desktop-app.dnd-mapp.net' as const;

export const ENV_NAME_WEB_SOCKET_SERVER_HOST = 'WEB_SOCKET_SERVER_HOST' as const;

export const WebSocketMessageTypes = {
    PORT_CHANGE: 'port-change',
    ID_ASSIGNMENT: 'id-assignment',
} as const;

export type WebSocketMessageType = (typeof WebSocketMessageTypes)[keyof typeof WebSocketMessageTypes];

interface PortChangeMessage {
    port: number;
}

interface IdAssignmentMessage {
    id: string;
}

interface WebSocketMessageDataDefinitions {
    [WebSocketMessageTypes.PORT_CHANGE]: PortChangeMessage;
    [WebSocketMessageTypes.ID_ASSIGNMENT]: IdAssignmentMessage;
}

export type WebSocketMessageData<MessageType extends WebSocketMessageType> =
    WebSocketMessageDataDefinitions[MessageType];
