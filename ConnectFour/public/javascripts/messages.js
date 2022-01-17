// @ts-nocheck

(function (exports) {

    exports.O_GAME_START = {
      type: "GAME-START",
    };
    exports.S_GAME_START = JSON.stringify(exports.O_GAME_START);

    exports.T_NEXT_MOVE = "NEXT-MOVE";
    exports.O_NEXT_MOVE = {
      type: exports.T_NEXT_MOVE,
      data: null,
    };
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null,
    };
  
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED",
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
      type: exports.T_PLAYER_TYPE,
      data: "A",
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    exports.O_PLAYER_B = {
      type: exports.T_PLAYER_TYPE,
      data: "B",
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null,
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);