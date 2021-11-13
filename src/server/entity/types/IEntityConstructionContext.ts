import IConnectecSocketInterface from "../../../shared/connection/websocket/types/IConnectedSocketInterface";
import IInstance from "../../instance/types/IInstance";


export default interface IEntityConstructionContext {
    instance: IInstance
    actor?: IConnectecSocketInterface[]
}