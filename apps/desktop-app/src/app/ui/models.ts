export interface WindowController {
    destroy(): void;
    showWindow(): Promise<void>;
    sendIpcMessage(channel: string, ...args: unknown[]): void;
}

export type Constructable<T extends WindowController> = new (...args: unknown[]) => T;
