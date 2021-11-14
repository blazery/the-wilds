import cuid from "cuid"
import IAction, { ActionUnion, ENTITY_DESPAWN, ENTITY_PROPERTY_UPDATE, ENTITY_SPAWN, IEntityData, IEntityDespawn, IEntityPropertyUpdate, IEntitySpawn } from "../../shared/action/types/server/IAction";
import { ActionUnion as ClientActionUnion } from "../../shared/action/types/client/IAction";
import SyncedData from "./SyncedData";
import IEntityConstructionContext from "./types/IEntityConstructionContext";


export type BahaviorSignature = (context: IEntityConstructionContext, action: ClientActionUnion, data: SyncedData) => void

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
            type: ENTITY_PROPERTY_UPDATE,
            instanceId: this._context.instance.id,
            entityId: this.getId(),
            key,
            value
        } as IEntityPropertyUpdate)
    }

    public handleAction(context: IEntityConstructionContext, action: ClientActionUnion): void {
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
            type: ENTITY_SPAWN,
            instanceId: this._context.instance.id,
            actors: this._context.actor?.map(a => a.getId()) || [],
            entityInfo: {
                id: this.getId(),
                behaviors: [
                    'movementBehaviour'
                ],
                data: this._syncedData.pickle()
            }
        } as IEntitySpawn)
    }

    public despawn(): void {
        this._context.instance.broadCast({
            type: ENTITY_DESPAWN,
            instanceId: this._context.instance.id,
            entityId: this.getId()
        } as IEntityDespawn)
    }

    public pickle(): IEntityData {
        return {
            id: this.getId(),
            behaviors: [
                'movementBehaviour'
            ],
            data: this._syncedData.pickle()
        }
    }
}