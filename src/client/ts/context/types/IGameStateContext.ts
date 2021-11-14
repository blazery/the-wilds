import { Application } from "@pixi/app";
import IConnectecSocketInterface from "../../../../shared/connection/websocket/types/IConnectedSocketInterface";

export interface IGameStateContext {
    app: Application
    connection: IConnectecSocketInterface
}