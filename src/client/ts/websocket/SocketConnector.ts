import WebsocketFactory from "../../../shared/connection/websocket/WebsocketFactory"
import SocketWrapper from "./SocketWrapper"


export default class SocketConnector {

    public static createConnectedSocket() {
        const socket = new WebSocket('ws://localhost:8999')
        const wrappedSocket = WebsocketFactory.setupSocket(new SocketWrapper(socket))
        return wrappedSocket;
    }
}