const express = require('express');
const app = express();
const PORT = 3050;

app.use(express.json()); //Used to parse JSON bodies
var urlencodedParser = (express.urlencoded({ extended: true }))//Parse URL-encoded bodies

//app.use( express.json() );
//app.use(express.urlencoded()); //Parse URL-encoded bodies

//app.post('/webhook', (req,res) => {
//    console.log('Webhook triggered:', req.body);
//    res.status(200).end()
//});

//app.post('/webhook', urlencodedParser, function (req, res) {
//  console.log('Webhook triggered:', req.body);
//  res.status(200).end()
//});

const doStuff = (foo) => (console.log("stuff happened"), console.log(foo));

app.post('/webhook', urlencodedParser, function (req, res) {
  let foo = req.body;
  doStuff(foo)
  res.status(200).end();
});

app.listen(
  PORT,
  () => console.log('we in the club, boys! http://localhost:3050')
);