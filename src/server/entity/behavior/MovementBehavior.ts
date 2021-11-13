import IAction, { ActionUnion, IMovementAction } from "../../action/types/IAction";
import Entity from "../Entity";
import SyncedData from "../SyncedData";
import IEntityConstructionContext from "../types/IEntityConstructionContext";

export default function createMovementBehaviour(instEntity: Entity) {
    return function (context: IEntityConstructionContext, action: ActionUnion, data: SyncedData) {
        if (action.type !== 'entity/move-action') return;

        const entity = context.instance.getEntity(action.entityId)


        if (!entity ||
            entity.getId() !== instEntity.getId() ||
            !context.actor?.find((a) => entity.canAct(a.getId()))) {
            return
        }

        data.setData('position', action.postition)
    }
}