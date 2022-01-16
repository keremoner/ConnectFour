// const target = document.getElementById("hello");
const socket = new WebSocket("ws://localhost:3000");
// socket.onmessage = function (event){
//     target.innerHTML = event.data;
// };

// Sets up gameState object
var gameState = function(){
    this.player = null;
    this.board = null;
    this.numberFlipped = null;
    this.time = null;
    this.gameOver = false;
};

const nextMoveButton = document.getElementById("nextMove");
const nextMoveField = document.getElementById("nextMoveField");
const yourMoves = document.getElementById("yourMoves");
const opponentMoves = document.getElementById("opponentMoves");
const statusField = document.getElementById("gameStatus");

nextMoveButton.disabled = true;
nextMoveField.disabled = true;
nextMoveButton.onclick = nextMoveF;

function nextMoveF(){

    //Sending the move to the server
    let msg = Messages.O_NEXT_MOVE;
    msg.data = Number(nextMoveField.value);
    socket.send(JSON.stringify(msg));

    //Updating our board and check if the game is finished
    update(1, msg.data);
    whoWon(msg.data);

}

function whoWon(move){
    winner = move;
    //Can make winner = 1 if we win, -1 if we lose, 0 if still continues and 2 if it is a tie.

    //The case we win after our move.
    if(winner == 1){
        //end game function
        nextMoveButton.disabled = true;
        nextMoveField.disabled = true;
        statusField.textContent = "\nGame is finished. You won.";
        
        let msg = Messages.O_GAME_OVER;
        msg.data = (gameState.player == 1 ? "A" : "B");
        socket.send(JSON.stringify(msg));
        socket.close();
    }

    else if(winner == -1){
        //end game function
        nextMoveButton.disabled = true;
        nextMoveField.disabled = true;
        statusField.textContent = "\nGame is finished. You lost.";
        
        let msg = Messages.O_GAME_OVER;
        msg.data = (gameState.player == -1 ? "A" : "B");
        socket.send(JSON.stringify(msg));
        socket.close();
    }

    //The case it is a tie after our move.
    else if(winner == 2){
        nextMoveButton.disabled = true;
        nextMoveField.disabled = true;
        statusField.textContent = "\nTurn: Your turn";
        
        let msg = Messages.O_GAME_OVER;
        msg.data = "TIE";
        socket.send(JSON.stringify(msg));
        socket.close();
    }
}

socket.onopen = function () {
    console.log("Connected");
};

socket.onmessage = function (event){
    console.log(event.data);
    let msg = JSON.parse(event.data);
    console.log(msg.type);

    //When the player type is sent.
    if(msg.type == Messages.T_PLAYER_TYPE){
        statusField.textContent = "Waiting for another player";
        if(msg.data == "A"){
            gameState.player = 1;
        }else{
            gameState.player = -1;
        }
    }

    //When the game starts
    else if(msg.type == Messages.O_GAME_START.type){
        console.log(gameState.player);
        if(gameState.player == 1){
            nextMoveButton.disabled = false;
            nextMoveField.disabled = false;

            statusField.textContent = "\nTurn: Your turn";
        }else{
            statusField.textContent = "\nTurn: Opponent's turn";
        }

    }

    //When the game is aborted
    else if(msg.type == Messages.O_GAME_ABORTED.type){
        statusField.textContent = "Game is aborted. Refresh the page if you want to join a new lobby.";
        nextMoveButton.disabled = true;
        nextMoveField.disabled = true;
    }

    //When the opponent sends its move
    else if(msg.type == Messages.T_NEXT_MOVE){
        update(-1, msg.data);
        whoWon(-msg.data);
    }    
}

function update(player, move){
    if(player == 1){
        yourMoves.textContent += move;
        statusField.textContent = "\nTurn: Opponent's turn";
        nextMoveButton.disabled = true;
        nextMoveField.disabled = true;
    }else{
        opponentMoves.textContent += move;
        statusField.textContent = "\nTurn: Your turn";
        nextMoveButton.disabled = false;
        nextMoveField.disabled = false;
    }
}