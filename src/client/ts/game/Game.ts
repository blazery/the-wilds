import IConnectecSocketInterface from "../../../shared/connection/websocket/types/IConnectedSocketInterface";
import Viewer from "../rendering/Viewer";
import SocketConnector from "../websocket/SocketConnector";
import *  as PIXI from "pixi.js";
import FreeRoamState from "./states/FreeRoamState";
import IGameState from "./states/types/IGameState";

export default class Game {

    protected viewer: Viewer;
    protected app: PIXI.Application;
    protected wrappedSocket: IConnectecSocketInterface;
    protected activeGameState: IGameState;
    protected gameStateStack: IGameState[];

    public constructor() {
        this.app = new PIXI.Application();

        this.viewer = new Viewer();
        this.viewer.connect(this.app);

        this.wrappedSocket = SocketConnector.createConnectedSocket()

        this.activeGameState = new FreeRoamState()
        this.activeGameState.initialize(this.app, this.viewer, this.wrappedSocket);
    }
}