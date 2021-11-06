import DataSender from "./DataSender";
import LifetimeTracker from "./LifetimeTracker";
import Socket from "./Socket";
import { ISocketInterface } from "./types/ISocketInterface";

export default class WebsocketFactory {


    public static setupSocket(ws: ISocketInterface) {
        const socket = new Socket(ws);

        socket.setLtt(new LifetimeTracker(ws))
        socket.setSender(new DataSender(ws))

        return socket;
    }
}