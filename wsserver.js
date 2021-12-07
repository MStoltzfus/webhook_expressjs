const Websocket = require('ws');
const server = new Websocket.Server({ port: 3080 });

console.log('WS Server started');

server.on('connection', socket => {
    socket.on('message', message => {

        console.log(message);

        socket.send('got it! ${message}');
    
    });
});