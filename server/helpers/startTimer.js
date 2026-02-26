function startRoomTimer(io, roomCode, activeRooms) {
    const room = activeRooms[roomCode];
    if (!room) return;

    let timeLeft = 15;

    if (room.intervalId) {
        clearInterval(room.intervalId);
        room.intervalId = null;
    }

    room.currentQuestion.correctCount = 0;
    room.currentQuestion.answeredPlayers.clear();

    room.intervalId = setInterval(() => {
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(room.intervalId);
            room.intervalId = null;
            return;
        }

        io.to(roomCode).emit("timer-update", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(room.intervalId);
            room.intervalId = null;

            handleRoundEnd(io, roomCode, activeRooms);
        }
    }, 1000);
}

function handleRoundEnd(io, roomCode, activeRooms) {
    const room = activeRooms[roomCode];
    if (!room) return;

    if (room.intervalId) {
        clearInterval(room.intervalId);
        room.intervalId = null;
    }

    const correctAns = room.currentQuestion.answer;
    io.to(roomCode).emit("show-answer", {
        correctAnswer: correctAns,
        leaderboard: room.players.sort((a, b) => b.score - a.score)
    });
    
    setTimeout(() => {
        room.currentIndex++;

        if (room.currentIndex < room.questions.length) {
            const nextQ = room.questions[room.currentIndex];
            room.currentQuestion.answer = nextQ.answer;

            io.to(roomCode).emit("next-question", nextQ);

            io.to(roomCode).emit("hint-data", room.hint[room.currentIndex])

            startRoomTimer(io, roomCode, activeRooms);
        } else {
            io.to(roomCode).emit("quiz-finished", room.players);
        }
    }, 3000);
}


module.exports = { startRoomTimer, handleRoundEnd }