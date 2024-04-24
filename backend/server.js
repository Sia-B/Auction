const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:3000/"
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New user joined" + socket.id);

  socket.on("joinRoom", ({ playerName, roomNo }) => {
    if (!rooms[roomNo]) {
      // Create a new room if it doesn't exist
      rooms[roomNo] = {
        players: [],
        inProgress: false // You can add more properties like game status
      };
    }

    socket.join(roomNo);
    rooms[roomNo].players.push({ id: socket.id, name: playerName });

    // Notify the client that they have successfully joined the room
    socket.emit("roomJoined", roomNo);

    // Send the current player names to all players in the room
    const currentPlayerNames = rooms[roomNo].players.map(player => player.name);
    console.log(currentPlayerNames)
    io.to(roomNo).emit("currentPlayers", currentPlayerNames);

    // Notify other players in the room about the new player
    socket.broadcast.to(roomNo).emit("playerJoined", playerName);

    socket.on("startAuction", (roomNo) => {
      io.to(roomNo).emit("startAuction");
    });
  
    socket.on("generatePainting", ({ roomNo, paintingValue, paintingId }) => {
      io.to(roomNo).emit("paintingGenerated", { paintingValue, paintingId });
    });


  });
});

httpServer.listen(8000);
