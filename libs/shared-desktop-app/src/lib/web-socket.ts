export const MIN_WEB_SOCKET_PORT = 0;

export const MAX_WEB_SOCKET_PORT = 65535;

export const DEFAULT_WEB_SOCKET_PORT = 8888;

export const WebSocketMessageTypes = {
    PORT_CHANGE: 'port-change',
    ID_ASSIGNMENT: 'id-assignment',
    PING: 'ping',
    PONG: 'pong',
} as const;

export type WebSocketMessageType = (typeof WebSocketMessageTypes)[keyof typeof WebSocketMessageTypes];

interface PortChangeMessage {
    port: number;
}

interface IdAssignmentMessage {
    id: string;
}

interface ClientIdMessageResponse {
    clientId: string;
}

interface WebSocketMessageDataDefinitions {
    [WebSocketMessageTypes.PORT_CHANGE]: PortChangeMessage;
    [WebSocketMessageTypes.ID_ASSIGNMENT]: IdAssignmentMessage;
    [WebSocketMessageTypes.PING]: ClientIdMessageResponse;
    [WebSocketMessageTypes.PONG]: ClientIdMessageResponse;
}

export type WebSocketMessageData<MessageType extends WebSocketMessageType> =
    WebSocketMessageDataDefinitions[MessageType];

export interface WebSocketMessage<
    MessageType extends WebSocketMessageType,
    MessageData = WebSocketMessageDataDefinitions[MessageType],
> {
    type: MessageType;
    data: MessageData;
}
