const express = require("express");
const http = require("http");
const websocket = require("ws");
const messages = require("./public/javascripts/messages");

const Game = require("./game");
const gameStats = require("./stats");

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


const websockets = {};
//Deleting finished games from the websockets
setInterval(function() {

    for(let i in websockets){
        if(Object.prototype.hasOwnProperty.call(websockets, i)){
            let gameObj = websockets[i];
            if(gameObj.isFinished()){
                console.log("Deleting websocket ID: " + i);
                delete websockets[i];
            }
        }
    }

}, 5000);

//Creating the first game
let currentGame = new Game(gameStats.gamesInitialized);
let connectionID = 0;


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

