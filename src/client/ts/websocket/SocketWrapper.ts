
import { ISendOptions, ISocketInterface } from '@shared/connection/websocket/types/ISocketInterface';

export default class SocketWrapper implements ISocketInterface {

    protected ws: WebSocket;

    public constructor(ws: WebSocket) {
        this.ws = ws
    }

    public send(msg: string | Object, opt?: ISendOptions) {
        if (this.readyState !== WebSocket.OPEN) return;

        if (typeof msg === "string") {
            this.ws.send(msg);
        } else {
            this.ws.send(JSON.stringify(msg));
        }
    }

    public on(evnt: string, cb: (msg: string) => void) {

        if (evnt === "message") {
            this.ws.addEventListener(evnt, (evt: MessageEvent<any>) => {
                if (evt.data) {
                    cb(evt.data);
                }
            });
        }

        if (evnt === "open") {
            this.ws.addEventListener(evnt, (evt: Event) => {
                cb("open");
            });
        }

        if (evnt === "close") {
            this.ws.addEventListener(evnt, (evt: CloseEvent) => {
                cb("close");
            });
        }
    }

    public terminate() {
        this.ws.close();
    }

    public ping() {
        this.send("ping");
    }

    public pong() {
        this.send("pong");
    }

    get readyState(): number {
        return this.ws.readyState;
    }
}