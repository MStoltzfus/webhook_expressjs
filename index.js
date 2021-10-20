const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3050;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

app.post('/webhook', urlencodedParser, function (req, res) {
  console.log('Webhook triggered:', req.body);
  res.status(200).end()
});

app.listen(
  PORT,
  () => console.log('we in the club, boys! http://localhost:3050')
);