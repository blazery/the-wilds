
export default interface IAction {
    type: string
    [x: string]: any
}

export interface IMovementAction extends IAction {
    type: "entity/move-action"
    instanceId: string
    entityId: string
    postition: [number, number];
}

export type ActionUnion = IAction | IMovementAction
