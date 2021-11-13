import cuid from "cuid";
import { ISocketInterface } from "../../shared/connection/websocket/types/ISocketInterface";
import Instance from "./Intstance";


export default class InstanceManager {


    protected instanceList: Instance[] = [];
    protected instanceById: Record<string, Instance> = {};
    protected playersByInstance: Record<string, ISocketInterface[]> = {};


    public constructor() {

    }


    public addInstance(instance: Instance) {
        const index = this.instanceList.indexOf(instance);
        if (index === -1) {
            this.instanceList.push(instance)
            this.instanceById[instance.id] = instance;

            instance.addOnPlayerAddListener((socket: ISocketInterface) => {
                const list = this.playersByInstance[instance.id] || [];
                this.playersByInstance[instance.id] = [...list, socket]
            })
        }
    }
}
