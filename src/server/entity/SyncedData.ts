import _ from "lodash";
import Entity from "./Entity";


export default class SyncedData {

    protected _data: Record<string, any> = {};
    protected _entity?: Entity;

    public setData(key: string, value: any): this {
        this._data[key] = value;
        this._entity?.sendProperyUpdate(key, value);
        return this;
    }

    public getData(key: string): any {
        return this._data[key]
    }

    public pickle(): Record<string, any> {
        return _.cloneDeep(this._data);
    }

    public connect(ent: Entity): any {
        return this._entity = ent;
    }
}