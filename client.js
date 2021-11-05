const socket = io();

socket.on('getcubes', item => {
    var cubes = item;
});
document.getElementById("start").addEventListener("click",function(){
    socket.emit("start",`User ${socket.id} has joined!`)
});