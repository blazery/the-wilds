import { Handler } from "express";
import { forEachChild } from "typescript";
import { WebSocket } from "ws";
import { DataSender } from "./DataSender";
import { LifetimeTracker } from "./LifetimeTracker";


export type HandlerSignature = (msg: string, socket: Socket) => void;
export class Socket {
    protected handlers: HandlerSignature[] = [];
    protected ws: WebSocket;

    protected sender?: DataSender;
    protected ltt?: LifetimeTracker;

    public constructor(ws: WebSocket) {
        this.ws = ws;
        this.setReceiver();
    }

    public setSender(sender: DataSender) {
        this.sender = sender
    }

    public setLtt(ltt: LifetimeTracker) {
        this.ltt = ltt
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
                handler(msg, this);
            }
        })
    }
}