const express = require('express');
const app = express();
const PORT = 3050;

app.use(express.json()); //Used to parse JSON bodies
var urlencodedParser = (express.urlencoded({ extended: true }))//Parse URL-encoded bodies

//Make sure you run "npm install -g localtunnel" (unless you already have localtunnel installed) and run "lt --port 3050" to make the webhook endpoint publicly available!

const doStuff = (foo, origin) => (console.log("The Webhook was Triggered!", origin), console.log(foo));

//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"
app.post('/webhook', urlencodedParser, function (req, res) {
  let foo = req.body;
  let origin = '/webhook';
  doStuff(foo, origin);
  res.send("POST Request Recieved! Pretty neat, ain't it!? You sent it to " + origin + ", right?");
  res.status(200).end();
});

//creates a "/" endpoint to the domain
app.post('/', urlencodedParser, function (req, res) {
  let foo = req.body;
  let origin = ' from /';
  doStuff(foo, origin);
  res.send("POST Request Recieved from " + origin);
  res.status(200).end();
});

app.listen(
  PORT,
  () => console.log('we in the club, boys! http://localhost:3050')
);