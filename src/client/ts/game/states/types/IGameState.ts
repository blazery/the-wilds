import *  as PIXI from "pixi.js";
import IConnectecSocketInterface from "../../../../../shared/connection/websocket/types/IConnectedSocketInterface";
import Viewer from "../../../rendering/Viewer";

export default interface IGameState {


    initialize(app: PIXI.Application, viewer: Viewer, connection: IConnectecSocketInterface): void;
}