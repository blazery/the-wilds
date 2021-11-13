import Instance from "./Intstance";


export default class InstanceFactory {

    public static createInstance(id: string) {
        return new Instance();
    }

}
