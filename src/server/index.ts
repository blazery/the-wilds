
// add this to get the shared folder working.
import 'module-alias/register';

import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import cors from 'cors';

import WebsocketFactory from '../shared/connection/websocket/WebsocketFactory';
import InstanceManager from './instance/InstanceManager';
import InstanceFactory from './instance/InstanceFactory';
import IConnectecSocketInterface from '../shared/connection/websocket/types/IConnectedSocketInterface';
import { CONNECTION_SETUP, IConnectionSetupAction } from '../shared/action/types/server/IAction';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance 
const wss = new WebSocket.Server({ server });

const instanceManager = new InstanceManager();
const intance = InstanceFactory.createInstance('');
instanceManager.addInstance(intance)

wss.on('connection', (ws: WebSocket) => {

    const socket = WebsocketFactory.setupSocket(ws);

    socket.registerHandler((msg: string | ArrayBuffer, socketRaw: IConnectecSocketInterface) => {
        //log the received message and send it back to the client
        const msgtoUse = typeof msg === "string" ? msg : msg.toString();
        console.log('received: %s', msgtoUse);
        ws.send(`Hello, you sent -> ${msgtoUse}`);

        try {
            const msgObject = JSON.parse(msgtoUse);
            instanceManager.handleAction(msgObject, socket);
        } catch {

        }
    })

    //send immediatly a feedback to the incoming connection    
    socket.send('Hi there, I am a WebSocket server');
    socket.send({ type: CONNECTION_SETUP, "playerId": socket.getId() } as IConnectionSetupAction);
    intance.addPlayerToInstance(socket);
});

//start our server 
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${(server.address() as WebSocket.AddressInfo).port} :)`);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.use(cors())
app.use(express.static('public'))


