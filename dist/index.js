import http from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import dayjs from "dayjs";
dotenv.config();
const app = express();
const port = process.env.PORT;
const pubUrl = process.env.URL;
const __dirname = "./public";
app.use(express.json({ limit: "500kb" })); //Used to parse JSON bodies
var urlencodedParser = express.urlencoded({ extended: true }); //Parse URL-encoded bodies
app.use(express.static("./public"));
const server = http.createServer(app);
const io = new Server(server);
const webhookTriggerResponse = (origin) => {
    console.log("The Webhook was Triggered!", origin);
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
/*
--
This is the start of the actual Express Routes Code
--
*/
//Creates a const array to store the data from the webhooks
//creates a "/webhook endpoint to the domain that can process post requests and console.logs the results"
app.options("/webhook"); // enable pre-flight request for POST request
app.post("/webhook", urlencodedParser, function (req, res) {
    let body = req.body;
    let origin = "/webhook";
    webhookTriggerResponse(origin);
    io.emit("webhookUpdate", body);
    console.log(body);
    res.send("Data POSTed. You can send a 'GET' request to " +
        origin +
        " get the current stored data. Note: Proper authorization required.");
    res.status(200).end();
});
//allows for incoming post requests to /
app.post("/", urlencodedParser, function (req, res) {
    let body = req.body;
    let origin = "/";
    res.send("POST Request Recieved from " + origin);
    res.status(200).end();
});
//allows for incoming get requests to /
app.get("/notanymore", (req, res) => {
    res.send("You did a thing! If you send a POST request to this endpoint, it should work too!");
    res.status(200).end();
});
//returns the public url when a get request is made to /url
app.get("/url", (req, res) => {
    res.send(pubUrl);
    res.status(200).end();
});
//clears the hookData variable
app.post("/cleardata", urlencodedParser, function (req, res) {
    let body = req.body;
    let origin = "/cleardata";
    if (req.headers["authkey"] == "1234567890") {
        console.log(`The submitted authkey '\ ${req.headers["authkey"]} '\ is valid`);
        console.log("request origin - " + origin);
        res.json({
            message: "This API has been deprecated during a massive refactor. Historical data is now completely handled client-side.",
        });
    }
    else {
        console.log("POST request to " + origin + " but the authkey was not valid.");
        res.send("No valid auth key - NOTICE - THIS API HAS BEEN DEPRECATED.");
    }
    res.status(200).end();
});
//server.listen should always be at the bottom of the index.ts file
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
