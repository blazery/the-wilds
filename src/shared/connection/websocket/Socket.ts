import cuid from "cuid";
import DataSender from "./DataSender";
import LifetimeTracker from "./LifetimeTracker";
import IConnectecSocketInterface, { CloseHandlerSignature, HandlerSignature } from "./types/IConnectedSocketInterface";
import { ISocketInterface } from "./types/ISocketInterface";


export default class Socket implements IConnectecSocketInterface {
    protected handlers: HandlerSignature[] = [];
    protected closeHandlers: CloseHandlerSignature[] = [];
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

    public registerCloseHandler(handler: CloseHandlerSignature) {
        this.closeHandlers.push(handler);
    }

    private setReceiver() {
        this.ws.on('message', (msg: string) => {
            for (const handler of this.handlers) {
                handler(msg, this);
            }
        })

        this.ws.on('close', () => {
            for (const handler of this.closeHandlers) {
                handler(this);
            }
        })
    }
}