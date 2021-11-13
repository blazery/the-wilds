import cuid from "cuid";
import { WebSocket } from "ws";
import { ISocketInterface } from "../../../shared/connection/websocket/types/ISocketInterface";


export default function wrapSocket(socket: WebSocket): ISocketInterface {

    const id = cuid();
    const freeObject = (socket as any)
    freeObject.getId = () => id;

    return freeObject as ISocketInterface;
}