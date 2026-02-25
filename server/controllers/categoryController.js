const categories = {}

class CategoryController {
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

    static setActivateCategory(io, roomCode, categoryName) {
        if (!categories[roomCode]?.includes(categoryName)) {
            return
            
        }

        io.to(roomCode.emit("active-category", categoryName))
    }
}

module.exports = CategoryController