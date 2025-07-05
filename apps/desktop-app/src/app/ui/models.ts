export interface WindowController {
    destroy(): Promise<void>;
    showWindow(): Promise<void>;
    sendIpcMessage(channel: string, ...args: unknown[]): Promise<void>;
}

export type Constructable<T extends WindowController> = new (...args: unknown[]) => T;
