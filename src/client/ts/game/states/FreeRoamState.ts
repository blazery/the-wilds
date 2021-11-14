import { access } from "fs";
import *  as PIXI from "pixi.js";
import { ActionUnion, CONNECTION_SETUP, ENTITY_SPAWN, IConnectionSetupAction, IInstanceJoinAction, INSTANCE_JOIN } from "../../../../shared/action/types/server/IAction";
import IConnectecSocketInterface from "../../../../shared/connection/websocket/types/IConnectedSocketInterface";
import IConnectedSocketInterface from "../../../../shared/connection/websocket/types/IConnectedSocketInterface";
import Viewer from "../../rendering/Viewer";
import Instance from "../objects/Instance";
import IGameState from "./types/IGameState";

export default class FreeRoamState implements IGameState {


    protected playerId: string;
    protected entityId: string;
    protected entities: Array<{ id: string, sprite: PIXI.Sprite }> = [];
    protected instance: Instance;


    public initialize(app: PIXI.Application, viewer: Viewer, connection: IConnectedSocketInterface): void {
        this.addClickListner(app, connection)
        this.addConnectionHandler(app, connection)
    }

    protected addClickListner(app: PIXI.Application, connection: IConnectecSocketInterface) {
        app.view.addEventListener("pointerdown", (evt) => {
            connection.send({
                type: "entity/move-action",
                instanceId: this.instance.getId(),
                entityId: this.entityId,
                postition: [evt.x, evt.y]
            })
        })
    }

    protected addConnectionHandler(app: PIXI.Application, connection: IConnectecSocketInterface) {
        connection.registerHandler((msg) => {

            var msgObject: ActionUnion = undefined;
            try {
                msgObject = typeof msg === "string" ? JSON.parse(msg) : {};
            } catch {
            }

            if (msgObject === undefined) return

            if (msgObject.type === CONNECTION_SETUP) {
                const obj: IConnectionSetupAction = msgObject;
                this.playerId = obj.playerId;
            } else if (msgObject.type === INSTANCE_JOIN) {
                const obj: IInstanceJoinAction = msgObject;
                this.instance = new Instance(obj.instanceId, { app, connection });
                this.instance.showWorld();
            } else {
                if (this.instance) {
                    this.instance.handleAction(msgObject);
                }
            }

            if (msgObject.type === ENTITY_SPAWN && msgObject.actors.includes(this.playerId)) {
                this.entityId = msgObject.entityInfo.id
            }
            // try {
            //     const msgObject = JSON.parse(msg);
            //     if (msgObject.type === 'entity/spawn') {
            //         let sprite = PIXI.Sprite.from('http://localhost:3000/media/knight.png');
            //         app.stage.addChild(sprite);
            //         sprite.pivot.x = 128
            //         sprite.pivot.y = 128
            //         sprite.width = 64
            //         sprite.height = 64
            //         if (msgObject.actors.includes(this.playerId)) {
            //             this.entityId = msgObject.entityId;
            //         }
            //         this.entities.push({ sprite, id: msgObject.entityId });
            //     } else if (msgObject.type === 'entity/despawn') {
            //         var ent = this.entities.find(e => e.id === msgObject.entityId);
            //         if (ent) {
            //             app.stage.removeChild(ent.sprite)
            //             this.entities.splice(this.entities.indexOf(ent), 1)
            //         }
            //     } else if (msgObject.type === 'connection/setup') {
            //         this.playerId = msgObject.playerId;
            //         this.instanceId = msgObject.instanceId;
            //     }
            //     else if (msgObject.type === 'entity/property-update') {
            //         var ent = this.entities.find(e => e.id === msgObject.entityId);
            //         if (ent) {
            //             ent.sprite.x = msgObject.value[0]
            //             ent.sprite.y = msgObject.value[1]
            //         }
            //     } else if (msgObject.type === 'instance/worldstate') {
            //         msgObject.entities.forEach(element => {
            //             let sprite = PIXI.Sprite.from('http://localhost:3000/media/knight.png');
            //             app.stage.addChild(sprite);
            //             sprite.pivot.x = 128
            //             sprite.pivot.y = 128
            //             sprite.width = 64
            //             sprite.height = 64
            //             sprite.x = element.data.position[0] || 0
            //             sprite.y = element.data.position[1] || 0
            //             this.entities.push({ sprite, id: element.entityId });
            //         });
            //     }
            // } catch {

            // }
            // console.log(msg);
        })
    }
}