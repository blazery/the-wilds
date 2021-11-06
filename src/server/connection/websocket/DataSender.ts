import { WebSocket } from "ws";

export class DataSender {

    private ws: WebSocket;

    public constructor(ws: WebSocket) {
        this.ws = ws;
    }

    public sendMessage(msg: string | Object) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(msg, { binary: false });
            return true
        }

        return false
    }
}