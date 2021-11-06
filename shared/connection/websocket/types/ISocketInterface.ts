

export interface ISendOptions {
    binary?: boolean
}
export interface ISocketInterface {

    send(msg: string | Object, opt: ISendOptions);
    on(evnt: string, cb: (msg: string) => void);
    terminate();
    ping();
    pong();
    readyState: number;
}