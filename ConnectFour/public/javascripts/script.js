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
            
            document.querySelector(".checker").style.opacity = 0;
            var disc = new Disc(1);
            disc.addToScene();
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
        case 'x':
            var player = ((id+1)%2)+1; //because when creating disc object we increment id
            dropDisc((id-1),player);
            break;
        
          break;
    }
   
  });



newgame();

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
    if(currentPlayer==2){
      document.querySelector(".gameBoard").innerHTML += '<div id="d'+this.id+'" class="checker" style="left='+(5+currentCol*5.69)+'vw'+';"><img src="'+this.src+'"></div>';
      currentCol = parseInt(window.prompt("Column"));
      dropDisc($this.id,$this.player);
    }else{document.querySelector(".gameBoard").innerHTML += '<div id="d'+this.id+'" class="checker" style="left=0px;"><img src="'+this.src+'"></div>';}
  
    
  }
  var $this = this;
  

  document.onmousemove = function(evt){
    currentCol = Math.floor((evt.clientX - document.querySelector(".gameBoard").offsetLeft)/((0.4*document.documentElement.clientWidth)/7));
    if(currentCol<0){currentCol=0;}
    if(currentCol>6){currentCol=6;}
    document.getElementById('d'+$this.id).style.left = (5.69*currentCol)+"vw";
  }
  document.onload = function(evt){
    if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - document.querySelector(".gameBoard").offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>6){currentCol=6;}
    document.getElementById('d'+$this.id).style.left = (5+5.69*currentCol)+"vw";
    }
  }
  document.onclick = function(evt){
    if(currentPlayer == 1){
      dropDisc($this.id,$this.player);
    }
  }
}

function dropDisc(cid,player){
  currentRow = firstFreeRow(currentCol,player);
  moveit(cid,(5.5 +currentRow*5.6));
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory(){
  if(!checkForVictory(currentRow,currentCol)){
    placeDisc(3-currentPlayer);
  } else {
    var ww = currentPlayer == 1 ? 'Player1' : 'Player2';
    placeDisc(3-currentPlayer);
    alert(ww+" win!");
    document.querySelector(".gameBoard").innerHTML = "";
    reset();
  }
}

function placeDisc(player){
  currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
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
  prepareField();
}
function sendTheMove(col){
}