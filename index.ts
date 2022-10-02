import http from "http";
import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const __dirname = "./public";

app.use(express.json({ limit: "500kb" })); //Used to parse JSON bodies
var urlencodedParser = express.urlencoded({ extended: true }); //Parse URL-encoded bodies

app.use(express.static("./public"));

const server = http.createServer(app);
const io = new Server(server);

const webhookTriggerResponse = (origin: string, userName: any) => {
  console.log("The Webhook was Triggered by", userName, "origin -", origin);
  console.log(dayjs().format("MMMM Do YYYY, h:mm:ss a"));
};

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.get("/chatclient", (req, res) => {
  res.sendFile("socketChatClient.html", { root: __dirname });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("userClear", (msg) => {
    console.log(msg, "Cleared History");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

});

console.log();

//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"

app.options("/webhook"); // enable pre-flight request for POST request
app.post("/webhook", urlencodedParser, function (req, res) {
  let body = req.body;
  let origin = "/webhook";

  var userName = req.query.userName;

  webhookTriggerResponse(origin, userName);

  io.emit("webhookUpdate" + userName, body);

  console.log(body);

  res.send(
    "Data POSTed. You can send a 'GET' request to " +
      origin +
      " get the current stored data. Note: Proper authorization required."
  );

  res.status(200).end();
});

//server.listen should always be at the bottom of the index.ts file
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
