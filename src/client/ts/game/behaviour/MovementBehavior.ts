import { ActionUnion, ENTITY_PROPERTY_UPDATE } from "../../../../shared/action/types/server/IAction";
import Data from "../objects/Data";
import Entity from "../objects/Entity";
import IEntityConstructionContext from "../objects/types/IEntityConstructionContext";

export default function createMovementBehaviour(instEntity: Entity) {
    return function (context: IEntityConstructionContext, action: ActionUnion, data: Data) {
        if (action.type !== ENTITY_PROPERTY_UPDATE) return;
        data.setData(action.key, action.value);

        if (action.key === "position") {
            const graphic = instEntity.getGraphic();
            graphic.x = action.value[0]
            graphic.y = action.value[1]
        }
    }
}