import { ISocketInterface, WebsocketStatus } from "./types/ISocketInterface";

export default class DataSender {

    private ws: ISocketInterface;

    protected messageQueue: string[] = [];

    public constructor(ws: ISocketInterface) {
        this.ws = ws;
    }

    public sendMessage(msg: string | Object) {
        const msgToSend = typeof msg === 'string' ? msg : JSON.stringify(msg);
        this.messageQueue.push(msgToSend);

        if (this.ws.readyState !== WebsocketStatus.OPEN) {
            return false
        }

        this.messageQueue.forEach((queueMsg) => {
            this.ws.send(queueMsg, { binary: false });
        })
        this.messageQueue = [];
        return true

    }
}