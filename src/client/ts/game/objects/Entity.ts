import Data from "./Data";
import ActionUnion from '../../../../shared/action/types/server/IAction'
import IEntityConstructionContext from "./types/IEntityConstructionContext";
import IAction from "../../../../shared/action/types/server/IAction";
import { Sprite } from "@pixi/sprite";


export type BahaviorSignature = (context: IEntityConstructionContext, action: ActionUnion, data: SyncedData) => void

export default class Entity {

    protected id: string;
    protected _graphic: Sprite;
    protected _syncedData: Data;
    protected _context: IEntityConstructionContext
    protected _actionHandlers: Array<BahaviorSignature>;

    public constructor(context: IEntityConstructionContext, id: string) {
        this._syncedData = new Data();
        this._syncedData.connect(this);
        this._context = context;
        this._actionHandlers = [];
        this.id = id
    }

    public getId(): string {
        return this.id
    }

    public setGraphic(sprite: Sprite): void {
        this._graphic = sprite;
    }

    public getGraphic(): Sprite {
        return this._graphic;
    }

    public handleAction(context: IEntityConstructionContext, action: IAction): void {
        this._actionHandlers.forEach((hfn) => {
            hfn(context, action, this._syncedData)
        })
    }

    public addBehavior(bh: BahaviorSignature): Entity {
        this._actionHandlers.push(bh)
        return this
    }

    public canAct(playerID: string): boolean {
        return true;
    }

    public spawn(): void {

    }

    public despawn(): void {

    }

    public pickle(): Record<string, any> {
        return {
            entityId: this.getId(),
            behaviors: [
                'movementBehaviour'
            ],
            data: this._syncedData.pickle()
        }
    }
}