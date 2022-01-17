const socket = new WebSocket("ws://localhost:3000");
const status = document.getElementsByClassName("status");

// Sets up gameState object
var gameState = function(){
  this.player = null;

  this.currentCol;
  this.gameFieldl;
  this.currentRowl;
  this.currentPlayer;
  this.id;
  this.yourTurn;
};

socket.onopen = function () {
  console.log("Connected");
};


socket.onmessage = function (event){
  let msg = JSON.parse(event.data);
  console.log(msg.type);

  //When the player type is sent.
  if(msg.type == Messages.T_PLAYER_TYPE){
      console.log("Waiting for another player.");
      if(msg.data == "A"){
          gameState.player = 1;
      }else{
          gameState.player = 2;
      }
  }

  //When the game starts
  else if(msg.type == Messages.O_GAME_START.type){
      console.log("Game started.");
      newgame();
      if(gameState.player == 1){
        console.log("Your turn.");
      }else{
        console.log("Opponent's turn.");        
      }

  }

  // //When the game is aborted
  // else if(msg.type == Messages.O_GAME_ABORTED.type){
  //     statusField.textContent = "Game is aborted. Refresh the page if you want to join a new lobby.";
  //     nextMoveButton.disabled = true;
  //     nextMoveField.disabled = true;
  // }

  //When the opponent sends its move
  else if(msg.type == Messages.T_NEXT_MOVE){

      var oppDisk = new Disc(3 - gameState.player);

      oppDisk.addToScene();
      gameState.currentCol = msg.data;
      document.getElementById('d'+oppDisk.id).style.left = (5.69*gameState.currentCol)+"vw";
      console.log("Karsi hamle geldi, sen " + gameState.player + "sin ve hamle col = " + msg.data);
      gameState.yourTurn = true;

      dropDisc(oppDisk.id, 3 - gameState.player);
      if(!checkForVictory(gameState.currentRow, gameState.currentCol)){
        placeDisc(gameState.player);
      }

      //update(-1, msg.data);
      //whoWon(-msg.data);
  }    
}


//Initializes the game by creating the gamefield array and
//placing the first checker to the table
function newgame(){
  
  gameState.id = 1;
  gameState.currentCol = 0;
  prepareField();
  
  if(gameState.player == 1){
    gameState.yourTurn = true;
    placeDisc(1);
  }else{
    gameState.yourTurn = false;
  }
}

function prepareField(){
    gameState.gameField = new Array();
    for(var i=0; i<6; i++){
      gameState.gameField[i] = new Array();
      for(var j=0; j<7; j++){
        gameState.gameField[i].push(0);
      }
    }
  }
  
// returns the same colored checkers that are adjecent 
function getAdj(row,col,row_inc,col_inc){
  if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
    return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
  } else {
    return 0;
  }
}
//returns the color of the checker
function cellVal(row,col){
  if(gameState.gameField[row] == undefined || gameState.gameField[row][col] == undefined){
    return -1;
  } else {
    return gameState.gameField[row][col];
  }
}
//returns first available row to drop the checker
function firstFreeRow(col,player){
  for(var i = 0; i<6; i++){
    if(gameState.gameField[i][col]!=0){
      break;
    }
  }
  gameState.gameField[i-1][col] = player;
  return i-1;
}
//constructor for the disc object where the image and id is initalized
function Disc(player){
  this.player = player;
  this.src = player == 1 ? 'images/p1.png' : 'images/p2.png';
  console.log(gameState.id + " diski player" + this.player + " icin olusturuldu");
  this.id = gameState.id.toString();
  gameState.id++;
  
  //Adds the checker image to the board
  this.addToScene = function(){
    //if the opponent puts a checker it will be first displayed on top of its column
    //for the user it is unnecessary as it is already clicked on top of intended column
    document.querySelector(".gameBoard").innerHTML += '<div id="d'+this.id+'" class="checker" style="left=0px;"><img src="'+this.src+'"></div>';

  }
  var $this = this;
    //user events for adjusting the checker
    document.onmousemove = function(evt){ 
      if(!gameState.yourTurn) return;
      gameState.currentCol = Math.floor((evt.clientX - document.querySelector(".gameBoard").offsetLeft)/((0.4*document.documentElement.clientWidth)/7));
      if(gameState.currentCol<0){gameState.currentCol=0;}
      if(gameState.currentCol>6){gameState.currentCol=6;}
      document.getElementById('d'+$this.id).style.left = (5.69*gameState.currentCol)+"vw";
    }
    //fuction for the user to drop the checker to the board
    document.onclick = function(evt){ 

      if(!gameState.yourTurn) return;
        //Sending the move to the server
        let msg = Messages.O_NEXT_MOVE;
        msg.data = gameState.currentCol;
        socket.send(JSON.stringify(msg));
        dropDisc($this.id,$this.player);
        gameState.yourTurn = false;
    }
}
  //drop function to move the checker image and check if it results in a win condition
  function dropDisc(cid,player){

    gameState.currentRow = firstFreeRow(gameState.currentCol,player);
    console.log("cid = " + cid);
    moveit(cid,(5.5 +gameState.currentRow*5.6));
    checkForMoveVictory();
    gameState.currentPlayer = 3 - gameState.currentPlayer;
  }
  
  function checkForMoveVictory(){

    if(checkForVictory(gameState.currentRow, gameState.currentCol)){
      var ww = gameState.currentPlayer == 1 ? 'Player1' : 'Player2';
      console.log(ww+" win!");
      gameState.yourTurn = false;
      //document.querySelector(".gameBoard").innerHTML = "";
      //reset();
    }
  }

//function to check every possible win condition return false if any of those didn't satisfied
function checkForVictory(row,col){
  if(getAdj(row,col,0,1)+getAdj(row,col,0,-1) > 2){
    return true;
  } else {
    if(getAdj(row,col,1,0) > 2){
      return true;
    } else {
      if(getAdj(row,col,-1,1)+getAdj(row,col,1,-1) > 2){
        return true;
      } else {
        if(getAdj(row,col,1,1)+getAdj(row,col,-1,-1) > 2){
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

//updates the current player and creates a disc object
function placeDisc(player){
  gameState.currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
}

//function to move the checker
function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'vw';
}
//bounce animation but it I couldn't code it
function bounce(who, where){
  document.getElementById('d'+who).style.top -= (where/4)+'vw';
}
//reset button (doesnt work)
function reset(){
  document.querySelector(".gameBoard").innerHTML = '<img src="images/background.png" class="backoftheboard"><img src="images/gameBoard.png" class="board"> ';
  flag=true;
  xpos =0;
  gameState.id= 1;
  prepareField();
}
//to send to the server
function sendTheMove(col){
}
if(window.matchMedia("(max-width: 500px)").matches){
  alert("Please use a larger screen to have more fun");
  documentElement.body.style.backgroundImage = url("p2.png");
}