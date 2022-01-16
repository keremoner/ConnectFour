let moveBy = 5.69;
let xpos = 0;
let currentCol = 0;

var gameField = new Array();
var currentRow;
var currentPlayer;
var id = 1;
var yourTurn = true;



newgame();
//Initializes the game by creating the gamefield array and
//placing the first checker to the table
function newgame(){
  prepareField();
  placeDisc(1);
}

function prepareField(){
    gameField = new Array();
    for(var i=0; i<6; i++){
      gameField[i] = new Array();
      for(var j=0; j<7; j++){
        gameField[i].push(0);
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
  if(gameField[row] == undefined || gameField[row][col] == undefined){
    return -1;
  } else {
    return gameField[row][col];
  }
}
//returns first available row to drop the checker
function firstFreeRow(col,player){
  for(var i = 0; i<6; i++){
    if(gameField[i][col]!=0){
      break;
    }
  }
  gameField[i-1][col] = player;
  return i-1;
}
//constructor for the disc object where the image and id is initalized
function Disc(player){
  this.player = player;
  this.src = player == 1 ? 'images/p1.png' : 'images/p2.png';
  this.id = id.toString();
  id++;
  
  //Adds the checker image to the board
  this.addToScene = function(){
    //if the opponent puts a checker it will be first displayed on top of its column
    //for the user it is unnecessary as it is already clicked on top of intended column
    if(currentPlayer==2){
      document.querySelector(".gameBoard").innerHTML += '<div id="d'+this.id+'" class="checker" style="left='+(5+currentCol*5.69)+'vw'+';"><img src="'+this.src+'"></div>';
      currentCol = parseInt(window.prompt("Column"));
      dropDisc($this.id,$this.player);
    }else{document.querySelector(".gameBoard").innerHTML += '<div id="d'+this.id+'" class="checker" style="left=0px;"><img src="'+this.src+'"></div>';}
  
    
  }
  var $this = this;
    //user events for adjusting the checker
    document.onmousemove = function(evt){ 
      if(!yourTurn) return;
      currentCol = Math.floor((evt.clientX - document.querySelector(".gameBoard").offsetLeft)/((0.4*document.documentElement.clientWidth)/7));
      if(currentCol<0){currentCol=0;}
      if(currentCol>6){currentCol=6;}
      document.getElementById('d'+$this.id).style.left = (5.69*currentCol)+"vw";
    }
    //fuction for the user to drop the checker to the board
    document.onclick = function(evt){ 
      if(!yourTurn) return;
      if(currentPlayer == 1){
        dropDisc($this.id,$this.player);
      }
    }
}
  //drop function to move the checker image and check if it results in a win condition
  function dropDisc(cid,player){
    currentRow = firstFreeRow(currentCol,player);
    moveit(cid,(5.5 +currentRow*5.6));
    currentPlayer = player;
    checkForMoveVictory();
  }
  
  function checkForMoveVictory(){
    if(!checkForVictory(currentRow,currentCol)){ //if the player couldn't win
      yourTurn =false;                           //disable the user inputs
    } else {
      var ww = currentPlayer == 1 ? 'Player1' : 'Player2';
      alert(ww+" win!");
      document.querySelector(".gameBoard").innerHTML = "";
      reset();
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
  currentPlayer = player;
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
  id= 1;
  prepareField();
}
//to send to the server
function sendTheMove(col){
}