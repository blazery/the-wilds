import "module-alias"

import *  as PIXI from "pixi.js";
import { emit } from "process";
import WebsocketFactory from '../../shared/connection/websocket/WebsocketFactory';
import SocketWrapper from "./websocket/SocketWrapper";

// Create the application helper and add its render target to the page
const container = document.getElementById("canvas-container")
if (!container) {
    throw "ERROR";
}

let app = new PIXI.Application({
    resizeTo: container,
})
container.appendChild(app.view);
// // Create the sprite and add it to the stage
// let sprite = PIXI.Sprite.from('http://localhost:3000/media/sample.jpg');
// app.stage.addChild(sprite);

// // Add a ticker callback to move the sprite back and forth
// let elapsed = 0.0;
// app.ticker.add((delta) => {
//     elapsed += delta;
//     sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
// });

const socket = new WebSocket('ws://localhost:8999')
const wrappedSocket = WebsocketFactory.setupSocket(new SocketWrapper(socket))

var playerId = '';
var instanceId = '';
var entityId = '';
var playerCharacter = null
var entities: Array<{ id: string, sprite: PIXI.Sprite }> = [];
app.view.addEventListener("pointerdown", (evt) => {
    wrappedSocket.send({
        type: "entity/move-action",
        instanceId,
        entityId,
        postition: [evt.x, evt.y]
    })
})

wrappedSocket.registerHandler((msg) => {
    try {
        const msgObject = JSON.parse(msg);
        if (msgObject.type === 'entity/spawn') {
            let sprite = PIXI.Sprite.from('http://localhost:3000/media/knight.png');
            app.stage.addChild(sprite);
            sprite.pivot.x = 128
            sprite.pivot.y = 128
            if (msgObject.actors.includes(playerId)) {
                playerCharacter = sprite;
                entityId = msgObject.entityId;
            }
            entities.push({ sprite, id: msgObject.entityId });
        } else if (msgObject.type === 'entity/despawn') {
            var ent = entities.find(e => e.id === msgObject.entityId);
            if (ent) {
                app.stage.removeChild(ent.sprite)
                entities.splice(entities.indexOf(ent), 1)
            }
        } else if (msgObject.type === 'connection/setup') {
            playerId = msgObject.playerId;
            instanceId = msgObject.instanceId;
        }
        else if (msgObject.type === 'entity/property-update') {
            var ent = entities.find(e => e.id === msgObject.entityId);
            if (ent) {
                ent.sprite.x = msgObject.value[0]
                ent.sprite.y = msgObject.value[1]
            }
        } else if (msgObject.type === 'instance/worldstate') {
            msgObject.entities.forEach(element => {
                let sprite = PIXI.Sprite.from('http://localhost:3000/media/knight.png');
                app.stage.addChild(sprite);
                sprite.pivot.x = 128
                sprite.pivot.y = 128
                sprite.x = element.data.position[0] || 0
                sprite.y = element.data.position[1] || 0
                entities.push({ sprite, id: element.entityId });
            });
        }
    } catch {

    }
    console.log(msg);
})


wrappedSocket.send("hello fuckers")