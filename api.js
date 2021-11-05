const express = require("express");
const app = express();
const server = require("http").createServer(app)
const io = require("socket.io")(server, { cors: { origin: "*", }, })

app.get("/", (req,res) => {
    var cubes = 0;
    res.sendFile(__dirname+"/index.html");
    io.on('connection', (socket) => {
        socket.userData={x: 0, y: 0, z: 0}
        console.log(`a user with id : ${socket.id} connected`);
        socket.emit('setId', {id: socket.id})
        socket.on('start', msg => {
            console.log(msg)
        })
        socket.on('init', init => {
            console.log("init")
            socket.userData.x = init.x
            socket.userData.y = init.y
            socket.userData.z = init.z
        });
        socket.on("update", data => {
            socket.userData.x = data.x
            socket.userData.y = data.y
            socket.userData.z = data.z
            socket.emit('remoteData', data)
        });
        socket.on("disconnect",msg => {
            console.log("left!")
            socket.broadcast.emit('deletePlayer', {id: socket.id})
        });
        socket.on("start", info => {
            var INFO = {
                id: socket.id,
                x: 0,
                y: 0,
                z: 0,
            }
            socket.emit('remoteData', INFO)
        })
    });
    
});
app.get("/orbit", (req,res) => {
    res.sendFile(__dirname+"/OrbitControls.js");
});
app.get("/file/:image", (req,res) => {
    res.sendFile(__dirname+"/imgs/"+req.params.image);
});
app.get("/script/:file", (req,res) => {
    res.sendFile(__dirname+"/"+req.params.file);
});


server.listen(3001, () => {
    console.log("Server up!")
})