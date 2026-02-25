const activeRooms = {}
const categories = {}

class QuizController {

                            
  // ROOM
  
  static createRoom(socket, roomData) {
    const roomCode = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()

    activeRooms[roomCode] = {
      roomName: roomData.roomName,
      maxPlayer: roomData.maxPlayer,
      players: []
    }

    socket.join(roomCode)

    socket.emit("room-created", {
      roomCode,
      activeRoom: activeRooms[roomCode]
    })
  }

  static getActiveRoom(socket, roomCode) {
    if (activeRooms[roomCode]) {
      socket.join(roomCode)
      socket.emit("active-room", activeRooms[roomCode])
    } else {
      socket.emit("active-room-not-found", "Room not found")
    }
  }

  static joinRoom(io, socket, playerData) {
    const { roomCode, name } = playerData
    const room = activeRooms[roomCode]

    if (!room) {
      socket.emit("active-room-not-found", "Room not found")
      return
    }

    if (room.players.length >= room.maxPlayer) {
      socket.emit("room-full", "Room is full")
      return
    }

    room.players.push(name)
    socket.join(roomCode)

    socket.emit("joined-room", {
      roomCode,
      activeRoom: room
    })

    io.to(roomCode).emit("player-joined", name)
  }

  
  // CATEGORY
  
  static addCategory(socket, data) {
    const { roomCode, categoryName } = data

    if (!categories[roomCode]) {
      categories[roomCode] = []
    }

    if (categories[roomCode].includes(categoryName)) {
      socket.emit("category-exists", "Category already exists")
      return
    }

    categories[roomCode].push(categoryName)

    socket.emit("category-added", {
      roomCode,
      categories: categories[roomCode]
    })
  }

  static getCategories(socket, roomCode) {
    socket.emit("categories", categories[roomCode] || [])
  }

  static setActiveCategory(io, roomCode, categoryName) {
    if (!categories[roomCode]?.includes(categoryName)) {
      socket.emit?.("category-not-found")
      return
    }

    io.to(roomCode).emit("active-category", categoryName)
  }
}

module.exports = QuizController