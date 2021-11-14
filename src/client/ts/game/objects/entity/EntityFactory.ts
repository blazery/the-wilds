import { Sprite } from "@pixi/sprite";
import { IEntityData } from "../../../../../shared/action/types/server/IAction";
import createMovementBehaviour from "../../behaviour/MovementBehavior";
import Entity from "../Entity";

export default class EntityFactory {
    public static createEntity(entD: IEntityData): Entity {
        const ent = new Entity({}, entD.id);

        const sprite = Sprite.from('http://localhost:3000/media/knight.png');
        sprite.pivot.x = 128
        sprite.pivot.y = 128
        sprite.width = 64
        sprite.height = 64
        ent.setGraphic(sprite);

        if (entD.behaviors.includes("movementBehaviour")) {
            ent.addBehavior(createMovementBehaviour(ent));
        }

        return ent;
    }
}