import cuid from "cuid"
import IAction, { ActionUnion } from "../action/types/IAction";
import SyncedData from "./SyncedData";
import IEntityConstructionContext from "./types/IEntityConstructionContext";


export type BahaviorSignature = (context: IEntityConstructionContext, action: ActionUnion, data: SyncedData) => void

export default class Entity {

    protected id: string = cuid();
    protected _syncedData: SyncedData;
    protected _context: IEntityConstructionContext
    protected _actionHandlers: Array<BahaviorSignature>;

    public constructor(context: IEntityConstructionContext) {
        this._syncedData = new SyncedData();
        this._syncedData.connect(this);
        this._context = context;
        this._actionHandlers = [];
    }

    public getId(): string {
        return this.id
    }

    public sendProperyUpdate(key: string, value: any) {
        this._context.instance.broadCast({
            type: 'entity/property-update',
            instanceId: this._context.instance.id,
            entityId: this.getId(),
            key,
            value
        })
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
        this._context.instance.broadCast({
            type: 'entity/spawn',
            instanceId: this._context.instance.id,
            actors: this._context.actor?.map(a => a.getId()) || [],
            entityId: this.getId(),
            behaviors: [
                'movementBehaviour'
            ],
            data: this._syncedData.pickle()
        })
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