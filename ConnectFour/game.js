//@ts-check

// THIS IS THE GAME MODEL FOR THE SERVER

const websocket = require("ws");

/**
 * Game constructor. Every game has two players, identified by their WebSocket.
 * @param {number} gameID every game has a unique game identifier.
 */
const game = function(gameID) {
  this.playerA = null;
  this.playerB = null;
  this.id = gameID;
  this.wordToGuess = null; //first player to join the game, can set the word
  this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

/**
 * Updates the game status to `w` if the state is valid and the transition to `w` is valid.
 * @param {string} w new game status
 */
game.prototype.setStatus = function(w) {
    this.gameState = w;
    console.log("[STATUS] %s", this.gameState);
};

/**
 * Update the word to guess in this game.
 * @param {string} w word to guess
 * @returns 
 */
game.prototype.setWord = function(w) {
  //two possible options for the current game state:
  //1 JOINT, 2 JOINT
  if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
    return new Error(
      `Trying to set word, but game status is ${this.gameState}`
    );
  }
  this.wordToGuess = w;
};

/**
 * Retrieves the word to guess.
 * @returns {string} the word to guess
 */
game.prototype.getWord = function() {
  return this.wordToGuess;
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