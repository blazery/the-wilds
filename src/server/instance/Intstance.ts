import cuid from "cuid";
import { type } from "os";
import IConnectecSocketInterface from "../../shared/connection/websocket/types/IConnectedSocketInterface";
import IAction, { IInstanceJoinAction, IInstanceWorldStateAction, INSTANCE_JOIN, INSTANCE_WORLDSTATE } from "../../shared/action/types/server/IAction";
import createMovementBehaviour from "../entity/behavior/movementBehavior";
import Entity from "../entity/Entity";
import IInstance, { PlayerAddListenerType, PlayerRemovedListenerType } from "./types/IInstance";

export default class Instance implements IInstance {

    public id: string;
    protected addListeners: PlayerAddListenerType[] = [];
    protected removeListeners: PlayerRemovedListenerType[] = [];
    protected players: IConnectecSocketInterface[] = [];
    protected entities: Entity[] = [];

    public constructor() {
        this.id = cuid();
    }

    public broadCast(action: IAction): void {
        this.players.forEach(p => p.send(action));
    }

    public getEntity(id: string): Entity | null {
        return this.entities.find(e => e.getId() === id) || null;
    }

    public addOnPlayerAddListener(listener: PlayerAddListenerType) {
        this.addListeners.push(listener)
    }

    public addOnPlayerRemovedListener(listener: PlayerRemovedListenerType) {
        this.removeListeners.push(listener)
    }

    protected triggerPlayerAdded(socket: IConnectecSocketInterface) {
        this.addListeners.forEach((fn) => {
            fn(socket)
        })
    }

    protected triggerPlayerRemoved(socket: IConnectecSocketInterface) {
        this.removeListeners.forEach((fn) => {
            fn(socket)
        })
    }

    public addPlayerToInstance(socket: IConnectecSocketInterface) {
        const index = this.players.indexOf(socket);
        if (index === -1) {
            this.players.push(socket)
            const ent = new Entity({ instance: this, actor: [socket] })
            ent.addBehavior(createMovementBehaviour(ent))

            socket.registerCloseHandler(() => {
                this.triggerPlayerRemoved(socket)
                this.despawnEntity(ent)
            })
            this.sendPlayerJoinInstance(socket);
            this.triggerPlayerAdded(socket);
            this.sendIntialGameState(socket);
            this.spawnEntity(ent);
        }
    }

    public spawnEntity(ent: Entity) {
        this.entities.push(ent)
        ent.spawn();
    }


    public despawnEntity(ent: Entity) {
        var index = this.entities.indexOf(ent)
        if (index > -1) {
            this.entities.splice(index, 1)
            ent.despawn();
        }
    }

    public sendIntialGameState(socket: IConnectecSocketInterface) {
        const state = this.entities.map(e => e.pickle());
        socket.send({ type: INSTANCE_WORLDSTATE, entities: state } as IInstanceWorldStateAction)
    }

    public sendPlayerJoinInstance(socket: IConnectecSocketInterface) {
        socket.send({ type: INSTANCE_JOIN, instanceId: this.id } as IInstanceJoinAction)
    }

    public handleAction(action: any, socket: IConnectecSocketInterface) {
        const ent = this.entities.find(e => e.getId() === action.entityId);
        const player = this.players.find(e => e.getId() === socket.getId());
        if (!ent || !player) return

        ent.handleAction({ instance: this, actor: [socket] }, action)
    }
}
