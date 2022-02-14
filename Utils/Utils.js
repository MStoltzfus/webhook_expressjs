import WebSocket from "ws";

const Utils = {
    foo() {
      console.log ('bar');
    },
    webhookTriggerResponse( origin ) {
      console.log( "The Webhook was Triggered!", origin );
      console.log( dayjs().format ( 'MMMM Do YYYY, h:mm:ss a' ) );
    },
    startWebsocketServer() {
      const server = new WebSocket.Server( { port: 3080 } );

      console.log( 'WS Server started' );
    
      server.on( 'connection', socket => {
        socket.on( 'message', message => {
          let received = '';
          received += message;
          console.log( 'message', received );
    
          socket.send( 'got it! ' + received );
    
        } );
      } );
    }
  };


export default Utils;