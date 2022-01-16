let moveBy = 5.69;
let xpos = 0;
let currentCol = 0;

var gameField = new Array();
var currentRow;
var currentPlayer;
var id = 1;
var flag = true;


window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'ArrowUp':
            alert("lol");
            document.querySelector(".checker").style.opacity = 0;
            break;
        case 'ArrowLeft':
          if(!flag){
            if(currentCol==0){
                break;
            }
            document.getElementById("d"+(id-1)).style.left = xpos - moveBy +'vw';
            xpos -= moveBy;
            currentCol -=1;
            break;
          }
        case 'ArrowRight':
          if(!flag){
            if(currentCol==6){
                break;
            }
            else{
                document.getElementById("d"+(id-1)).style.left = xpos +moveBy + 'vw';
                xpos +=moveBy;
                currentCol +=1;
                break;
            }
          }
        case ' ':
          if(flag){
            var player = ((id+1)%2)+1;
            var disc = new Disc(player);
            xpos=0;
            currentCol=0;
            disc.addToScene();
            flag= false;
            break;
          }
          break;
        case 'x':
          if(!flag){
            var player = ((id)%2)+1; //because when creating disc object we increment id
            dropDisc((id-1),player);
            flag=true;
            break;
          }
          break;
    }
   
});



newgame();

function newgame(){
  prepareField();
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
  
function getAdj(row,col,row_inc,col_inc){
  if(cellVal(row,col) == cellVal(row+row_inc,col+col_inc)){
    return 1+getAdj(row+row_inc,col+col_inc,row_inc,col_inc);
  } else {
    return 0;
  }
}

function cellVal(row,col){
  if(gameField[row] == undefined || gameField[row][col] == undefined){
    return -1;
  } else {
    return gameField[row][col];
  }
}

function firstFreeRow(col,player){
  for(var i = 0; i<6; i++){
    if(gameField[i][col]!=0){
      break;
    }
  }
  gameField[i-1][col] = player;
  return i-1;
}

function Disc(player){
  this.player = player;
  this.src = player == 1 ? 'images/p1.png' : 'images/p2.png';
  this.id = id.toString();
  id++;
  
  this.addToScene = function(){
  document.querySelector(".gameBoard").innerHTML += '<div id="d'+this.id+'" class="checker" style="left=0px;"><img src="'+this.src+'"></div>';
    /* if(currentPlayer==2){
      
    }*/
  }
  
  var $this = this;
}

function dropDisc(cid,player){
  currentRow = firstFreeRow(currentCol,player);
  moveit(cid,(5.5 +currentRow*5.6));
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory(){
  if(!checkForVictory(currentRow,currentCol)){
  } else {
    var ww = currentPlayer == 2 ? 'Player1' : 'Player2';
    alert(ww+" win!");
    document.querySelector(".gameBoard").innerHTML.innerHTML = "";
    reset();
  }
}


function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'vw';
}
function bounce(who, where){
  document.getElementById('d'+who).style.top -= (where/4)+'vw';
}
function reset(){
  document.querySelector(".gameBoard").innerHTML = '<img src="images/background.png" class="backoftheboard"><img src="images/gameBoard.png" class="board"> ';
  flag=true;
  xpos =0;
  id= 1;
  newgame();
}
function sendTheMove(row,col){
}