const express = require('express')
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000
const Controller = require('./Controller/controller')
const cors = require('cors')

app.use(cors())

// routes
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/categories', Controller.getCategories)
app.get('/categories/:id', Controller.getQuestions)


const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "*",
    }
});

const activeRooms = {};

io.on("connection", async (socket) => {
    
    socket.on("create-room", (roomData) => {
        const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase()
        roomData.roomCode = roomCode

        activeRooms[roomCode] = {
            roomName: roomData.roomName,
            maxPlayer: roomData.maxPlayer,
            players: []
        }

        socket.join(roomCode)

        socket.emit("room-created", {roomCode, activeRoom: activeRooms[roomCode]})
    })


    socket.on("get-active-room", (roomCode) => {

        if(activeRooms[roomCode]) {
            socket.join(roomCode)
            socket.emit("active-room", activeRooms[roomCode])
        } else {
            socket.emit("active-room-not-found", 'Room not found')
        }
    })


    socket.on("join-room", (playerData) => {
        const {roomCode, name} = playerData
        const room = activeRooms[roomCode]
         
        if(room){   
            if(activeRooms[roomCode].players.length < activeRooms[roomCode].maxPlayer) {
                
                activeRooms[roomCode].players.push(name)
                socket.join(roomCode)
                console.log(
                "ROOM MEMBERS:",
                [...(io.sockets.adapter.rooms.get(roomCode) || [])]
                )
                socket.emit("joined-room", {roomCode, activeRoom: activeRooms[roomCode]})
                io.to(roomCode).emit("player-joined", name)
            } else {
                socket.emit("room-full", 'Room is full')
            }
        } else {
            socket.emit("active-room-not-found", 'Room not found')
        }
    })
})

httpServer.listen(port, () => {
    console.log(`Website is running on port ${port}`);
})