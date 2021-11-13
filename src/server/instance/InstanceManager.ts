import IConnectecSocketInterface from "../../shared/connection/websocket/types/IConnectedSocketInterface";
import Instance from "./Intstance";


export default class InstanceManager {


    protected instanceList: Instance[] = [];
    protected instanceById: Record<string, Instance> = {};
    protected playersByInstance: Record<string, IConnectecSocketInterface[]> = {};


    public constructor() {

    }

    public handleAction(action: any, socket: IConnectecSocketInterface) {
        const inst = this.instanceById[action.instanceId];
        inst.handleAction(action, socket)

    }


    public addInstance(instance: Instance) {
        const index = this.instanceList.indexOf(instance);
        if (index === -1) {
            this.instanceList.push(instance)
            this.instanceById[instance.id] = instance;

            instance.addOnPlayerAddListener((socket: IConnectecSocketInterface) => {
                const list = this.playersByInstance[instance.id] || [];
                this.playersByInstance[instance.id] = [...list, socket]
            })

            instance.addOnPlayerRemovedListener((socket: IConnectecSocketInterface) => {
                const list = this.playersByInstance[instance.id] || [];
                this.playersByInstance[instance.id] = list.filter(e => e.getId() !== socket.getId());
            })
        }
    }
}
