import { WebSocket } from "ws";
import { ISocketInterface, WebsocketStatus } from "./types/ISocketInterface";


export default class LifetimeTracker {

    protected ws: ISocketInterface;
    protected isAlive: boolean = false;
    protected enabelMonitoring: boolean = false;
    protected timeout: NodeJS.Timeout | undefined;

    constructor(ws: ISocketInterface) {
        this.ws = ws;

        if (ws.readyState === WebsocketStatus.CONNECTING
            || ws.readyState === WebsocketStatus.OPEN) {
            this.isAlive = true;
        }

        this.setupListener();
        this.checkHeartbeat();
    }

    public destroy() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    protected checkHeartbeat() {
        const socket = this.ws;
        if (!socket) return;

        if (!this.isAlive) {
            socket.terminate();
            return
        }

        if (this.ws.readyState === WebsocketStatus.OPEN) {
            this.isAlive = false;
            this.ws.send("ping", { binary: false });
        }

        if (this.enabelMonitoring) {
            this.timeout = setTimeout(() => this.checkHeartbeat(), 1000);
        }
    }

    protected setupListener() {
        this.ws.on('message', (msg: string | ArrayBuffer) => {

            const msgtoUse = typeof msg === "string" ? msg : msg.toString();

            if (msgtoUse === "pong") {
                this.isAlive = true;
            } else if (msgtoUse === "ping") {
                if (this.ws.readyState === WebsocketStatus.OPEN) {
                    this.ws.send("pong", { binary: false });
                }
            }

        })

        this.ws.on('close', () => {
            this.ws.terminate();
        })
    }
}