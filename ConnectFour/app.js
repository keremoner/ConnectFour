const express = require("express");
const http = require("http");
const websocket = require("ws");
const indexRouter = require("./routes/index");
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
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);
app.get('/', function(req, res) {
  //example of data to render; here gameStatus is an object holding this information
  res.render('splash.ejs', { gamesInitialized: gameStats.gamesInitialized, gamesCompleted: gameStats.gamesCompleted, gamesAborted: gameStats.gamesAborted });
})


//Initializing the server and websocket
const server = http.createServer(app);
const wss = new websocket.Server({ server });


const websockets = {};
//Deleting finished games from the websockets
// setInterval(function() {

//     for(let i in websockets){
//         if(Object.prototype.hasOwnProperty.call(websockets, i)){
//             let gameObj = websockets[i];
//             if(gameObj.isFinished()){
//                 console.log("Deleting websocket ID: " + i);
//                 delete websockets[i];
//             }
//         }
//     }

// }, 5000);

//Creating the first game
let currentGame = new Game(gameStats.gamesInitialized);
let connectionID = 0;


//What to do when a client connects to the server
wss.on("connection", function(ws){

  const con = ws;
  con["id"] = connectionID++;
  const playerType = currentGame.addPlayer(con);
  websockets[con["id"]] = currentGame;

  console.log(
    `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
  );

  con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);

  if(playerType == "B"){

    let startMessage = messages.S_GAME_START;

    // Instructs the players to start the game, sets proper player turns
    currentGame.playerA.send(startMessage);
    currentGame.playerB.send(startMessage);
  }
  
  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new Game(gameStats.gamesInitialized++);
  }

  con.on("message", function incoming(message) {
    const oMsg = JSON.parse(message.toString());

    const gameObj = websockets[con["id"]];
    const isPlayerA = gameObj.playerA == con ? true : false;

    if (oMsg.type == messages.T_GAME_OVER && gameObj.gameState) {
      gameObj.setStatus(oMsg.data);
      gameStats.gamesCompleted++;
  }

    if (isPlayerA) {
      /*
       * player A cannot do a lot, just send the target word;
       * if player B is already available, send message to B
       */
      if (oMsg.type == messages.T_NEXT_MOVE) {
        gameObj.playerB.send(message.toString());
      }
    } else {
      /*
       * player B can make a guess;
       * this guess is forwarded to A
       */
      if (oMsg.type == messages.T_NEXT_MOVE) {
        gameObj.playerA.send(message.toString());
        gameObj.setStatus("CHAR GUESSED");
      }
    }
  });
  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(`${con["id"]} disconnected ...`);

    if (code == 1001) {
      /*
       * if possible, abort the game; if not, the game is already completed
       */
      const gameObj = websockets[con["id"]];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
        gameObj.setStatus("ABORTED");
        gameStats.gamesAborted++;

        /*
         * determine whose connection remains open;
         * close it
         */
        try {
          gameObj.playerA.send(messages.S_GAME_ABORTED);
          gameObj.playerA.close();
          gameObj.playerA = null;
        } catch (e) {
          console.log("Player A closing: " + e);
        }

        try {
          gameObj.playerB.send(messages.S_GAME_ABORTED);
          gameObj.playerB.close();
          gameObj.playerB = null;
        } catch (e) {
          console.log("Player B closing: " + e);
        }
      }
    }
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

