const express = require('express');
const localtunnel = require('localtunnel');
const moment = require('moment');
const app = express();
const PORT = 3050;

app.use(express.json()); //Used to parse JSON bodies
var urlencodedParser = (express.urlencoded({ extended: true }))//Parse URL-encoded bodies

const doStuff = (body, origin) => {
  console.log("The Webhook was Triggered!", origin);
  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
  console.log(body);
};
const openTunnel = async (PORT) => {
  const tunnel = await localtunnel({ port: PORT });
  console.log('Public tunnel live on ' + tunnel.url);
};

//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"
app.post('/webhook', urlencodedParser, function (req, res) {
  let body = req.body;
  let origin = '/webhook';
  doStuff(body, origin);
  res.send("POST Request Recieved! Pretty neat, ain't it!? You sent it to " + origin + ", right?");
  res.status(200).end();
});

//creates a "/" endpoint to the domain

app.post('/', urlencodedParser, function (req, res) {
  let body = req.body;
  let origin = '/';
  doStuff(body, origin);
  res.send("POST Request Recieved from " + origin);
  res.status(200).end();
});

app.get("/", (req, res, next) => {
  res.send("You did a thing! If you send a POST request to this endpoint, it should work too!");
  res.status(200).end();
});

app.get("/webhook", (req, res, next) => {
  res.send("You did a thing, but for the /webhook!!! If you send a POST request to this endpoint, it should work too!");
  res.status(200).end();
});

app.listen(
  PORT,
  () => {
    console.log('Service Is Running! http://localhost:3050');
    openTunnel(PORT);
  }
);
