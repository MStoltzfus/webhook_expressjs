const express = require( 'express' );
const cors = require( 'cors' )
const moment = require( 'moment' );
const Websocket = require( 'ws' )

const app = express();
const PORT = process.env.PORT || 3050;
var pubUrl = process.env.URL;

//starts the expressJS app
app.listen( PORT, () => {
  console.log( 'Service Is Running! http://localhost:3050 & ' + pubUrl );

  startWebsocket();

} );

app.use( express.json( { limit: '500kb' } ) ); //Used to parse JSON bodies
var urlencodedParser = ( express.urlencoded( { extended: true } ) )//Parse URL-encoded bodies

app.use( express.static( 'public' ) ); //serves the frontend page (index.html)

const webhookTriggerResponse = ( origin ) => {
  console.log( "The Webhook was Triggered!", origin );
  console.log( moment().format( 'MMMM Do YYYY, h:mm:ss a' ) );
};

const startWebsocket = () => {
  const server = new Websocket.Server( { port: 3080 } );

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

/*
--
This is the start of the actual Express Routes Code
--
*/

//Creates a const array to store the data from the webhooks
var hookData = null;

//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"
const webhookCorsConfig = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.options( '/webhook', cors(webhookCorsConfig) ) // enable pre-flight request for POST request
app.post( '/webhook', cors(webhookCorsConfig), urlencodedParser, function ( req, res ) {
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
  webhookTriggerResponse( body, origin );
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