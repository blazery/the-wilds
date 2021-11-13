import DataSender from "../DataSender";
import LifetimeTracker from "../LifetimeTracker";
import { ISocketInterface } from "./ISocketInterface";


export type HandlerSignature = (msg: string, socket: IConnectecSocketInterface) => void;
export type CloseHandlerSignature = (socket: IConnectecSocketInterface) => void;
export default interface IConnectecSocketInterface {

    setSender(sender: DataSender): void;
    setLtt(ltt: LifetimeTracker): void;
    getId(): string;
    send(msg: string | object): void;
    registerHandler(handler: HandlerSignature): void;
    registerCloseHandler(handler: CloseHandlerSignature): void;
}