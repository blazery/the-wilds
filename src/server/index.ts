
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Socket } from './connection/websocket/Socket';
import { WebsocketFactory } from './connection/websocket/WebsocketFactory';

const app = express.default();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    const socket = WebsocketFactory.setupSocket(ws);

    socket.registerHandler((msg: string, socket: Socket) => {
        //log the received message and send it back to the client
        console.log('received: %s', msg);
        ws.send(`Hello, you sent -> ${msg}`);
    })

    //send immediatly a feedback to the incoming connection    
    socket.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${(server.address() as WebSocket.AddressInfo).port} :)`);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use(express.static('public'))