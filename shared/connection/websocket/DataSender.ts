import { WebSocket } from "ws";
import { ISocketInterface } from "./types/ISocketInterface";

export default class DataSender {

    private ws: ISocketInterface;

    public constructor(ws: ISocketInterface) {
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