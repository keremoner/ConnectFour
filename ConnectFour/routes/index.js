const express = require("express");
const router = express.Router();

const gameStatus = require("../stats");


// router.get("/", function(req, res) {
//   res.sendFile("splash.html", { root: "./public" });
// });

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
  res.sendFile("gameScreen.html", { root: "./public" });
});


router.get('/', function(req, res) {
  //example of data to render; here gameStatus is an object holding this information
  res.render('splash.ejs', { gamesInitialized: gameStatus.gamesInitialized, gamesCompleted: gameStatus.gamesCompleted });
})

module.exports = router;