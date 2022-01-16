let player = 0;

const target = document.getElementById("hello");
const socket = new WebSocket("ws://localhost:3000");
socket.onmessage = function (event){
    target.innerHTML = event.data;
};

socket.onopen = function () {
    socket.send("Hello from the client!");
    target.innerHTML = "Sending a first message to the server ...";
};