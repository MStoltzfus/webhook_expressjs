const express = require('express');
const localtunnel = require('localtunnel');
const moment = require('moment');
const app = express();
const PORT = 3050;

app.use(express.json()); //Used to parse JSON bodies
var urlencodedParser = (express.urlencoded({ extended: true }))//Parse URL-encoded bodies
var pubUrl = "";

const webhookTriggerResponse = (body, origin) => {
  console.log("The Webhook was Triggered!", origin);
  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
  console.log(body);
};

//opens local-tunnel, logs the url, and sets the pubUrl variable, which the get /url route uses to return a value
const openTunnel = async (PORT) => {
  const tunnel = await localtunnel({ port: PORT });
  console.log('Public tunnel live on ' + tunnel.url);
  console.log('If you want to retrieve the public url for a running instance of this app at any time, you can send a \'GET\' request to localhost:3050/url');
  pubUrl = tunnel.url;
};

//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"
app.post('/webhook', urlencodedParser, function (req, res) {
  let body = req.body;
  let origin = '/webhook';
  webhookTriggerResponse(body, origin);
  res.send("POST Request Recieved! Pretty neat, ain't it!? You sent it to " + origin + ", right?");
  res.status(200).end();
});

//allows for incoming post requests to /webhook
app.post('/', urlencodedParser, function (req, res) {
  let body = req.body;
  let origin = '/';
  webhookTriggerResponse(body, origin);
  res.send("POST Request Recieved from " + origin);
  res.status(200).end();
});

//allows for incoming get requests to / 
app.get("/", (req, res) => {
  res.send("You did a thing! If you send a POST request to this endpoint, it should work too!");
  res.status(200).end();
});

//returns the public url when a get request is made to /url
app.get("/url", (req, res) => {
  res.send(pubUrl);
  res.status(200).end();
});

//allows for incoming post requests to /webhook
app.get("/webhook", (req, res) => {
  res.send("You did a thing, but for the /webhook!!! If you send a POST request to this endpoint, it should work too!");
  res.status(200).end();
});

//starts the expressJS app
app.listen( PORT, pubUrl, () => {
    console.log('Service Is Running! http://localhost:3050');
    openTunnel(PORT, pubUrl);
  }
);
