const express = require('express')
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  // ...
})

app.listen(port, () => {
    console.log(`Website is running on port ${port}`);
})