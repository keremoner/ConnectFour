const express = require("express");
const router = express.Router();

const gameStats = require("../stats");


// router.get("/", function(req, res) {
//   res.sendFile("splash.html", { root: "./public" });
// });

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
  res.sendFile("game.html", { root: "./public" });
});


router.get('/', function(req, res) {
  //example of data to render; here gameStatus is an object holding this information
  res.render('splash.ejs', { gamesInitialized: gameStats.gamesInitialized, gamesCompleted: gameStats.gamesCompleted, gamesAborted: gameStats.gamesAborted });
})

module.exports = router;