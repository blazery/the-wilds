import cuid from "cuid";
import DataSender from "./DataSender";
import LifetimeTracker from "./LifetimeTracker";
import { ISocketInterface } from "./types/ISocketInterface";


export type HandlerSignature = (msg: string, socket: ISocketInterface) => void;
export default class Socket {
    protected handlers: HandlerSignature[] = [];
    protected ws: ISocketInterface;
    protected id: string;

    protected sender?: DataSender;
    protected ltt?: LifetimeTracker;

    public constructor(ws: ISocketInterface) {
        this.ws = ws;
        this.setReceiver();
        this.id = cuid();
    }

    public setSender(sender: DataSender) {
        this.sender = sender
    }

    public setLtt(ltt: LifetimeTracker) {
        this.ltt = ltt
    }


    public getId(): string {
        return this.id;
    }


    public send(msg: string | object) {
        this.sender?.sendMessage(msg);
    }


    public registerHandler(handler: HandlerSignature) {
        this.handlers.push(handler);
    }

    private setReceiver() {
        this.ws.on('message', (msg: string) => {
            for (const handler of this.handlers) {
                handler(msg, this.ws);
            }
        })
    }
}