require('dotenv').config()
const express = require('express')
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000
const Controller = require('./Controller/controller')
const cors = require('cors');
const { default: baseUrl } = require('./constant/baseUrl');
const axios = require('axios');
const {startRoomTimer, handleRoundEnd} = require('./helpers/startTimer');

app.use(cors())

// routes
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/categories', Controller.getCategories)
app.get('/categories/:id', Controller.getQuestions)
app.post('/generate-hint/:id', Controller.generateHint)


const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "*",
    }
});

const activeRooms = {};

io.on("connection", async (socket) => {
    
    socket.on("create-room", (roomData) => {
        if(!roomData.roomName || !roomData.maxPlayer || !roomData.hostName || !roomData.category) {
            socket.emit("room-creation-failed", 'All fields are required')
            return
        }

        const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase()
        roomData.roomCode = roomCode
        
        activeRooms[roomCode] = {
            roomName: roomData.roomName,
            maxPlayer: roomData.maxPlayer,
            category: roomData.category,
            hostName: roomData.hostName,
            players: [{
                name: roomData.hostName,
                score:0
            }],
            currentQuestion: {
                answer: "Option A",
                correctCount: 0, // This resets every question
                answeredPlayers: new Set() // Tracks who has already submitted
            }
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
            
        activeRooms[roomCode].players.push({name, score:0})

        socket.join(roomCode)

        console.log("Active room:", activeRooms[roomCode]);
        socket.emit("joined-room", {roomCode, activeRoom: activeRooms[roomCode]})
        io.to(roomCode).emit("player-joined", name)
        
    })


    socket.on("start-quiz", async (roomCode) => {
        if (activeRooms[roomCode]) {
            activeRooms[roomCode].isStarted = true;
            io.to(roomCode).emit("quiz-started");
        }
    })

    socket.on("get-quiz-data", async (roomCode) => {
        try{
            const room = activeRooms[roomCode];
            if (!room) return;
            
            io.to(roomCode).emit('loading', true)

            const {data} = await axios.get(`${baseUrl}/categories/${room.category}`)
            const {data: hintData} = await axios.post(`${baseUrl}/generate-hint/${room.category}`,{})
            
            room.hint = hintData.hint;
            room.questions = data.Questions; 
            room.currentIndex = 0;

            room.currentQuestion.answer = room.questions[room.currentIndex].answer

            io.to(roomCode).emit("quiz-data", data.Questions[room.currentIndex])

            io.to(roomCode).emit("hint-data", hintData.hint[room.currentIndex])

            if (!room.intervalId) {
                startRoomTimer(io, roomCode, activeRooms);
            }
        } catch (error) {
            console.log(error);
        }
        
    })

    socket.on("submit-answer", ({roomCode, playerName, answer}) => {
        const room = activeRooms[roomCode];
        if (!room || room.currentQuestion.answeredPlayers.has(playerName)) return;

        room.currentQuestion.answeredPlayers.add(playerName);

        const isCorrect = answer === room.currentQuestion.answer;
        let pointsEarned = 0;

        if (isCorrect) {
            const basePoints = 1000;
            const penalty = room.currentQuestion.correctCount * 200;
            pointsEarned = Math.max(200, basePoints - penalty); // Min 200 pts

            const player = room.players.find(p => p.name === playerName);

            if (player) {
                player.score += pointsEarned;
            }

            room.currentQuestion.correctCount++;
        }

        const player = room.players.find(p => p.name === playerName);
        socket.emit("answer-result", { isCorrect, pointsEarned, totalScore: player.score });

        if (room.currentQuestion.answeredPlayers.size === room.players.length) {
            if (room.intervalId) {
                clearInterval(room.intervalId);
                room.intervalId = null;
            }
            
            handleRoundEnd(io, roomCode, activeRooms);
        }

    })

    socket.on("message-new", (messageData) => {
        console.log(`${socket.handshake?.auth?.name} send message: ${messageData.message} to room ${messageData.roomCode}`)   
        io.to(messageData.roomCode).emit("message-received", {
            from: messageData.name,
            message: messageData.message,
        })
    })

    socket.on("get-final-leaderboard", (roomCode) => {
        const room = activeRooms[roomCode];
        if (!room) return;

        const finalLeaderboard = room.players.sort((a, b) => b.score - a.score);
        socket.emit("final-leaderboard", finalLeaderboard)
    })
})

httpServer.listen(port, () => {
    console.log(`Website is running on port ${port}`);
})