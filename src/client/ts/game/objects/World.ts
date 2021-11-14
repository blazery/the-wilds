import { Container, DisplayObject } from "@pixi/display";
import { IEntityData } from "../../../../shared/action/types/server/IAction";
import { IInstanceContext } from "../../context/types/IInstanceContext";
import Entity from "./Entity";
import EntityFactory from "./entity/EntityFactory";

export default class World {
    protected stage: Container = new Container();
    protected entities: Entity[] = [];
    protected context: IInstanceContext;

    public constructor(context: IInstanceContext) {
        this.context = context;
    }

    protected clearWorld() {
        const len = this.entities.length;
        if (!len) return;

        for (let i = len - 1; len >= 0; i--) {
            this.stage.removeChildAt(i);
        }

        this.entities = [];
    }


    public setEntities(entities: IEntityData[]) {
        this.clearWorld();
        entities.forEach(e => this.spawnEntity(e));
    }


    public getStage(): Container {
        return this.stage;
    }

    public spawnEntity(entity: IEntityData) {
        const ent = EntityFactory.createEntity(entity)
        ent.spawn();
        this.stage.addChild(ent.getGraphic());
        this.entities.push(ent);
    }

    public despawnEntity(id: string) {
        const ent = this.getEntity(id)
        if (ent) {
            ent.despawn();
            this.stage.removeChild(ent.getGraphic());
        }
    }

    public getEntity(id: string): Entity | null {
        return this.entities.find(e => e.getId() === id) || null
    }

}