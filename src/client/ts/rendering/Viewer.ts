
import *  as PIXI from "pixi.js";

export default class Viewer {
    public connect(app: PIXI.Application) {
        const container = document.getElementById("canvas-container")
        if (!container) {
            throw "ERROR";
        }

        container.appendChild(app.view);
        app.resizeTo = container;
    }
}