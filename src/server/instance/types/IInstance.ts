import { ActionUnion } from "../../../shared/action/types/server/IAction";
import Entity from "../../entity/Entity";
import IConnectecSocketInterface from "../../shared/connection/websocket/types/IConnectedSocketInterface";


export type PlayerAddListenerType = (player: IConnectecSocketInterface) => void
export type PlayerRemovedListenerType = (player: IConnectecSocketInterface) => void

export default interface IInstance {

    id: string;

    addOnPlayerAddListener(listener: PlayerAddListenerType): void
    addOnPlayerRemovedListener(listener: PlayerRemovedListenerType): void
    addPlayerToInstance(socket: IConnectecSocketInterface): void
    broadCast(action: ActionUnion): void
    getEntity(id: string): Entity | null
}
