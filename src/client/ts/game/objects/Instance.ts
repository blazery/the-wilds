import { ActionUnion, ENTITY_DESPAWN, ENTITY_PROPERTY_UPDATE, ENTITY_SPAWN, INSTANCE_WORLDSTATE } from "../../../../shared/action/types/server/IAction";
import { IGameStateContext } from "../../context/types/IGameStateContext";
import World from "./World";

import { ActionUnion as ClientActionUnion } from "../../../../shared/action/types/client/IAction"


export default class Instance {

    protected id: string;
    protected world: World;
    protected context: IGameStateContext;

    public constructor(id: string, context: IGameStateContext) {
        this.id = id
        this.context = context
        this.world = new World({ instance: this });
    }

    public getId() {
        return this.id;
    }

    public showWorld() {
        this.context.app.stage = this.world.getStage();
    }


    public sendAction(action: ClientActionUnion) {
        this.context.connection.send(action);
    }

    public handleAction(action: ActionUnion) {
        switch (action.type) {
            case INSTANCE_WORLDSTATE:
                this.world.setEntities(action.entities);
                break;
            case ENTITY_SPAWN:
                this.world.spawnEntity(action.entityInfo);
                break;
            case ENTITY_DESPAWN:
                this.world.despawnEntity(action.entityId);
                break;
            case ENTITY_PROPERTY_UPDATE:
                const ent = this.world.getEntity(action.entityId);
                if (ent) {
                    ent.handleAction({ instance: this }, action);
                }
                break;
        }
    }
}