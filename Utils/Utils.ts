import dayjs from "dayjs";
import { Server } from "socket.io";
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const Utils = {
    webhookTriggerResponse( origin ) {
      console.log( "The Webhook was Triggered!", origin );
      console.log( dayjs().format ( 'MMMM Do YYYY, h:mm:ss a' ) );
    },
    startWebsocketServer() {
      const server = http.createServer(app);

      console.log( 'WS Server started' );
    
      io.on('connection', (socket) => {
        console.log('a user connected');
      });
      
      server.listen(3080, () => {
        console.log('listening on *:3080');
      });
    }
  };


export default Utils;