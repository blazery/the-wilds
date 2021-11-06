import { WebSocket } from "ws";


export class LifetimeTracker {

    protected ws: WebSocket;
    protected isAlive: boolean = false;
    protected timeout: NodeJS.Timeout | undefined;

    constructor(ws: WebSocket) {
        this.ws = ws;

        if (ws.readyState === WebSocket.CONNECTING
            || ws.readyState === WebSocket.OPEN) {
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

        if (socket.readyState !== WebSocket.OPEN || !this.isAlive) {
            socket.terminate();
            return
        }

        this.isAlive = false;
        socket.ping();
        this.timeout = setTimeout(() => this.checkHeartbeat(), 500);
    }

    protected setupListener() {
        this.ws.on('pong', () => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.isAlive = true;
                this.ws.pong();
            }
        })
        this.ws.on('close', () => {
            this.isAlive = false;
            this.ws.terminate();
        })
    }
}