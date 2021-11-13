import "module-alias"

import *  as PIXI from "pixi.js";
import WebsocketFactory from '../../shared/connection/websocket/WebsocketFactory';
import SocketWrapper from "./websocket/SocketWrapper";


// Create the application helper and add its render target to the page
const container = document.getElementById("canvas-container")
if (container) {
    let app = new PIXI.Application({
        resizeTo: container,
    })
    container.appendChild(app.view);
    // Create the sprite and add it to the stage
    let sprite = PIXI.Sprite.from('http://localhost:3000/media/sample.jpg');
    app.stage.addChild(sprite);

    // Add a ticker callback to move the sprite back and forth
    let elapsed = 0.0;
    app.ticker.add((delta) => {
        elapsed += delta;
        sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
    });
}


const socket = new WebSocket('ws://localhost:8999')
const wrappedSocket = WebsocketFactory.setupSocket(new SocketWrapper(socket))


wrappedSocket.registerHandler((msg) => {
    console.log(msg);
})

wrappedSocket.send("hello fuckers")