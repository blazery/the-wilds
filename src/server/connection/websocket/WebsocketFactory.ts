import { WebSocket } from "ws";
import { DataSender } from "./DataSender";
import { LifetimeTracker } from "./LifetimeTracker";
import { Socket } from "./Socket";

export class WebsocketFactory {


    public static setupSocket(ws: WebSocket) {
        const socket = new Socket(ws);

        socket.setLtt(new LifetimeTracker(ws))
        socket.setSender(new DataSender(ws))

        return socket;
    }
}