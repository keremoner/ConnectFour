const express = require("express");
const http = require("http");
const websocket = require("ws");
const messages = require("./public/javascripts/messages");

//Checking the arguments
if (process.argv.length < 3) {
  console.log("Usage: node app.js <port>");
  process.exit(1);
}

//Initializing the express process and port
const port = process.argv[2];
const app = express();

//Setting the default directory
app.use(express.static(__dirname + "/public"));

//Initializing the server and websocket
const server = http.createServer(app);
const wss = new websocket.Server({ server });

//Setting the opening page of the website
app.get("/", function(req, res){
  res.sendFile("splash.html", { root: "./public" });
})

//Setting what to do when ws connection is on
wss.on("connection", function(ws){
  setTimeout(function () {
    console.log("Connection state: " + ws.readyState);
    ws.send("Thanks for the message. --Your server.");
    ws.close();
    console.log("Connection state: " + ws.readyState);
  }, 2000);

  //Setting what to do when a client sends a message to server.
  ws.on("message", function incoming(message) {
    console.log(" [LOG] " + message);
  });
});

server.listen(port);

// let htmlPrefix = "<!DOCTYPE html><html><head></head><body><h1>";
// let htmlSuffix = "</h1></body></html>";

// app.get("/goodbye", function (req, res) {
//   res.send(htmlPrefix + "Goodbye to you too!" + htmlSuffix);
// });

// app.get("/*", function (req, res) {
//   res.send("Not a valid route ...");
// });

