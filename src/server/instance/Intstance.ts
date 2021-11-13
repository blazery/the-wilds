import cuid from "cuid";
import { ISocketInterface } from "../../shared/connection/websocket/types/ISocketInterface";


export type PlayerAddListenerType = (player: ISocketInterface) => void

export default class Instance {

    public id: string;
    protected addListeners: PlayerAddListenerType[] = [];
    protected players: ISocketInterface[] = [];


    public constructor() {
        this.id = cuid();
    }

    public addOnPlayerAddListener(listener: PlayerAddListenerType) {
        this.addListeners.push(listener)
    }

    protected triggerPlayerAdded(socket: ISocketInterface) {
        this.addListeners.forEach((fn) => {
            fn(socket)
        })
    }

    public addPlayerToInstance(socket: ISocketInterface) {
        const index = this.players.indexOf(socket);
        if (index === -1) {
            this.players.push(socket)
            this.triggerPlayerAdded(socket);
        }
    }

}
