const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:3000/"
});

const rooms = {}

io.on("connection", (socket) => {
  console.log("New user joined" + socket.id);

  socket.on("joinRoom", ({ playerName, roomNo }) => {
    console.log(`${playerName} joined room ${roomNo}`);
    socket.join(roomNo)
    if(!rooms[roomNo]){
      rooms[roomNo] = {
        players: []
      }
    }
    const playerRole = rooms[roomNo].players.length === 0? 'player1':'player2'
    rooms[roomNo].players.push({id: socket.id, name: playerName, role: playerRole})
    console.log(rooms[23])

    io.to(roomNo).emit("currentPlayers", rooms[roomNo].players.map(player => ({name: player.name, role:player.role})))
    // You can implement logic here to handle the joining of the room, such as storing player information, emitting events to other clients in the room, etc.
  }); 

  socket.on("startAuction", ({playerName, roomNo})=>{
    console.log(playerName, "Clicked from", roomNo)
  })

})





httpServer.listen(8000);
