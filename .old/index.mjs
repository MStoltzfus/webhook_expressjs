import express from "express";
import cors from "cors";
import http from 'http';
import { createServer } from "http";
import { Server } from "socket.io";
//import Utils from './Utils/Utils';
import { webhookCorsConfig } from "./Config/expressConfig.js";


const app = express();
const PORT = process.env.PORT || 3050;
var pubUrl = process.env.URL;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5174"
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3080);

//starts the expressJS app
app.listen( PORT, () => {
  console.log( 'Service Is Running! http://localhost:3050 & ' + pubUrl );
} );

app.use(cors())
app.use( express.json( { limit: '500kb' } ) ); //Used to parse JSON bodies
var urlencodedParser = ( express.urlencoded( { extended: true } ) )//Parse URL-encoded bodies

app.use( express.static( 'public' ) ); //serves the frontend page (index.html)

/*
--
This is the start of the actual Express Routes Code
--
*/

//Creates a const array to store the data from the webhooks
var hookData = null;

//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"

app.options( '/webhook') // enable pre-flight request for POST request
app.post( '/webhook', urlencodedParser, function ( req, res ) {
  let i = 0;
  let body = req.body;
  let origin = '/webhook';
  webhookTriggerResponse( origin );
  if ( hookData !== null ) {
    hookData.push( body );
  } else {
    hookData = [];
    hookData.push( body );
  };
  console.log( hookData )
  res.send( "Data POSTed. You can send a '\GET'\ request to " + origin + " get the current stored data. Note: Proper authorization required." );

  //Websocket.send( hookData );

  res.status( 200 ).end();
} );

//allows for incoming post requests to /
app.post( '/', urlencodedParser, function ( req, res ) {
  let body = req.body;
  let origin = '/';
  res.send( "POST Request Recieved from " + origin );
  res.status( 200 ).end();
} );

//allows for incoming get requests to / 
app.get( "/notanymore", ( req, res ) => {
  res.send( "You did a thing! If you send a POST request to this endpoint, it should work too!" );
  res.status( 200 ).end();
} );

//returns the public url when a get request is made to /url
app.get( "/url", ( req, res ) => {
  res.send( pubUrl );
  res.status( 200 ).end();
} );

//allows for incoming get requests to /webhook
app.get( "/webhook", ( req, res ) => {
  if ( req.headers['authkey'] == "1234567890" ) {
    if ( hookData !== null ) {
      res.json( {
        message: "Your Auth Key was valid, so you get data!!!",
        data: hookData
      } );
    } else {
      res.json( {
        message: "Your Auth Key was valid, but there is no data to return!"
      } );
    }
  } else {
    console.log( 'invalid authkey' );
    res.send( "No valid auth key" );
  };
  res.status( 200 ).end();
  console.log( 'GET request to /webhook' );
} );

//clears the hookData variable
app.post( '/cleardata', urlencodedParser, function ( req, res ) {
  let body = req.body;
  let origin = '/cleardata';
  if ( req.headers['authkey'] == "1234567890" ) {
    console.log( `The submitted authkey '\ ${req.headers['authkey']} '\ is valid` );
    console.log( 'request origin - ' + origin )
    hookData = null;
    res.json( {
      message: "The submitted authkey was valid. Data cleared.",
      data: hookData
    } );
    console.log( 'POST request to ' + origin + ' - the \'hookData\' array has been cleared' );
  } else {
    console.log( 'POST request to ' + origin + ' but the authkey was not valid. The \'hookData\' array has NOT been cleared' );
    res.send( "No valid auth key" );
  };
  res.status( 200 ).end();
} );