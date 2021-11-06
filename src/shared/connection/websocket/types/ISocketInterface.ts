

export interface ISendOptions {
    binary?: boolean
}

export interface ISocketInterface {
    send(msg: string | Object, opt: ISendOptions): void;
    on(evnt: string, cb: (msg: string) => void): void;
    terminate(): void;
    ping(): void;
    pong(): void;
    readyState: number;
}

export const WebsocketStatus = {
    /** The connection is not yet open. */
    CONNECTING: 0,
    /** The connection is open and ready to communicate. */
    OPEN: 1,
    /** The connection is in the process of closing. */
    CLOSING: 2,
    /** The connection is closed. */
    CLOSED: 3
}