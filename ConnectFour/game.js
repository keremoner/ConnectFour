//@ts-check

const websocket = require("ws");

const game = function(gameID) {
  this.playerA = null;
  this.playerB = null;
  this.id = gameID;
  this.gameState = "0 JOINT"; 
};

game.prototype.transitionStates = { 
  "0 JOINT": 0, 
  "1 JOINT": 1, 
  "2 JOINT": 2,
  "PLAYING": 3,
  "A": 4, //A won
  "B": 5, //B won
  "TIE": 6,
  "ABORTED": 7
};

game.prototype.transitionMatrix = [
  [0, 1, 0, 0, 0, 0, 0, 0], //0 JOINT
  [1, 0, 1, 0, 0, 0, 0, 0], //1 JOINT
  [0, 0, 0, 1, 0, 0, 0, 1], //2 JOINT (note: once we have two players, there is no way back!)
  [0, 0, 0, 1, 1, 1, 1, 1], //Playing
  [0, 0, 0, 0, 0, 0, 0, 0], //A WON
  [0, 0, 0, 0, 0, 0, 0, 0], //B WON
  [0, 0, 0, 0, 0, 0, 0, 0], //TIE
  [0, 0, 0, 0, 0, 0, 0, 0] //ABORTED
];

game.prototype.isValidTransition = function(from, to) {
  let i, j;
  if (!(from in game.prototype.transitionStates)) {
    return false;
  } else {
    i = game.prototype.transitionStates[from];
  }

  if (!(to in game.prototype.transitionStates)) {
    return false;
  } else {
    j = game.prototype.transitionStates[to];
  }

  return game.prototype.transitionMatrix[i][j] > 0;
};

game.prototype.isValidState = function(s) {
  return s in game.prototype.transitionStates;
};

game.prototype.setStatus = function(w) {
  if (
    game.prototype.isValidState(w) &&
    game.prototype.isValidTransition(this.gameState, w)
  ) {
    this.gameState = w;
    console.log("[STATUS] %s", this.gameState);
  } else {
    return new Error(
      `Impossible status change from ${this.gameState} to ${w}`
    );
  }
};

/**
 * Checks whether the game is full.
 * @returns {boolean} returns true if the game is full (2 players), false otherwise
 */
game.prototype.hasTwoConnectedPlayers = function() {
  return this.gameState == "2 JOINT";
};

/**
 * Adds a player to the game. Returns an error if a player cannot be added to the current game.
 * @param {websocket} p WebSocket object of the player
 * @returns {(string|Error)} returns "A" or "B" depending on the player added; returns an error if that isn't possible
 */
game.prototype.addPlayer = function(p) {
  if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
    return new Error(
      `Invalid call to addPlayer, current state is ${this.gameState}`
    );
  }

  const error = this.setStatus("1 JOINT");
  if (error instanceof Error) {
    this.setStatus("2 JOINT");
  }

  if (this.playerA == null) {
    this.playerA = p;
    return "A";
  } else {
    this.playerB = p;
    return "B";
  }
};

module.exports = game;