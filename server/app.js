const express = require('express')
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000

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
            category: roomData.category,
            hostname: roomData.hostName,
            players: [roomData.hostName]
        }

        socket.join(roomCode)

        socket.emit("room-created", {roomCode, activeRoom: activeRooms[roomCode]})
    })


    socket.on("get-active-room", (roomCode) => {

        if(!activeRooms[roomCode]) {
            socket.emit("active-room-not-found", 'Room not found')
            return
        }

        socket.join(roomCode)
        socket.emit("active-room", activeRooms[roomCode])
    })


    socket.on("join-room", (playerData) => {
        const {roomCode, name} = playerData
        const room = activeRooms[roomCode]
        
        if(!room){
            socket.emit("active-room-not-found", 'Room not found')
            return
        }
    
        if(activeRooms[roomCode].players.length === Number(activeRooms[roomCode].maxPlayer)) {
            socket.emit("room-full", 'Room is full')
            return
        }
            
        activeRooms[roomCode].players.push(name)

        socket.join(roomCode)

        console.log("Active room:", activeRooms[roomCode]);
        socket.emit("joined-room", {roomCode, activeRoom: activeRooms[roomCode]})
        io.to(roomCode).emit("player-joined", name)
        
    })


    socket.on("start-quiz", (roomCode) => {
        io.to(roomCode).emit("quiz-started")
    })

    socket.on("message-new", (messageData) => {
        console.log(`${socket.handshake?.auth?.name} send message: ${messageData.message} to room ${messageData.roomCode}`)   
        io.to(messageData.roomCode).emit("message-received", {
            from: messageData.name,
            message: messageData.message,
        })
    })
})

httpServer.listen(port, () => {
    console.log(`Website is running on port ${port}`);
})