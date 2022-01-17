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
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

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


    if (oMsg.type == messages.T_GAME_OVER && gameObj.gameState == "PLAYING") {
      gameObj.setStatus(oMsg.data);
      gameStats.gamesCompleted++;
  }
  console.log(oMsg.type + " " + gameObj.gameState);

    if (isPlayerA) {

      if (oMsg.type == messages.T_NEXT_MOVE) {
        gameObj.playerB.send(message.toString());
      }
    } else {
      if (oMsg.type == messages.T_NEXT_MOVE) {
        gameObj.playerA.send(message.toString());
      }
    }
    gameObj.setStatus("PLAYING");
  });
  con.on("close", function(code) {
    console.log(`${con["id"]} disconnected ...`);

    if (code == 1001) {
      const gameObj = websockets[con["id"]];
      if(gameObj.gameState == "1 JOINT"){
        gameObj.setStatus("0 JOINT");
        gameObj.playerA = null;
      }else{
        if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
          gameObj.setStatus("ABORTED");
          gameStats.gamesAborted++;
  
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


    }
  });

});

server.listen(port);
