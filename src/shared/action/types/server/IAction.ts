
export default interface IAction {
    type: string
}

export const CONNECTION_SETUP = "connection/setup"

export const INSTANCE_JOIN = "instance/join"
export const INSTANCE_WORLDSTATE = "instance/worldstate"


export const ENTITY_ACTION_BASE = "entity"
export const ENTITY_SPAWN = "entity/spawn"
export const ENTITY_DESPAWN = "entity/despawn"
export const ENTITY_PROPERTY_UPDATE = "entity/property-update"

export type ConenctionActions = IConnectionSetupAction
export interface IConnectionSetupAction extends IAction {
    type: typeof CONNECTION_SETUP
    playerId: string
}

export type InstanceActions = IInstanceJoinAction | IInstanceWorldStateAction
export interface IInstanceJoinAction extends IAction {
    type: typeof INSTANCE_JOIN
    instanceId: string
}
export interface IInstanceWorldStateAction extends IAction {
    type: typeof INSTANCE_WORLDSTATE
    entities: IEntityData[]
}

export type EntityActions = IEntitySpawn | IEntityDespawn | IEntityPropertyUpdate
export interface IEntitySpawn extends IAction {
    type: typeof ENTITY_SPAWN
    instanceId: string,
    actors: string[]
    entityInfo: IEntityData
}
export interface IEntityDespawn extends IAction {
    type: typeof ENTITY_DESPAWN
    instanceId: string,
    entityId: string,
}
export interface IEntityPropertyUpdate extends IAction {
    type: typeof ENTITY_PROPERTY_UPDATE
    instanceId: string
    entityId: string
    key: string
    value: any
}
export interface IEntityData {
    id: string
    behaviors: string[]
    data: Record<string, any>
}
export type ActionUnion = ConenctionActions | InstanceActions | EntityActions
