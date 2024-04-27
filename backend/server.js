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
        players: [],
        playersReady: 0
      }
    }
    const playerRole = rooms[roomNo].players.length === 0? 'player1':'player2'
    rooms[roomNo].players.push({id: socket.id, name: playerName, role: playerRole})
    console.log(rooms[23])

    io.to(roomNo).emit("currentPlayers", rooms[roomNo].players.map(player => ({name: player.name, role:player.role})))
    // You can implement logic here to handle the joining of the room, such as storing player information, emitting events to other clients in the room, etc.
  }); 

  let playersReady = 0;

  socket.on("startAuction", ({playerName, roomNo})=>{
    console.log(playerName, "Clicked from", roomNo)
    if (playerName && roomNo) {
      // Increment playersReady count for the room
      rooms[roomNo].playersReady++;
      console.log(rooms[roomNo].playersReady);
      if (rooms[roomNo].playersReady === 2) {
        io.to(roomNo).emit("bothPlayersStartedAuction");
        rooms[roomNo].playersReady = 0; // Reset playersReady for the next auction
      }
    }
  })
  socket.on('placeBid', ({ playerName, roomNo, amount }) => {
    console.log(playerName, "Has bid", amount)
    const room = rooms[roomNo];
    const currentPlayer = room.players.find(player => player.name === playerName);
    const nextPlayer = currentPlayer.role === 'player1' ? 'player2' : 'player1';
    console.log(nextPlayer)
  
    // Emit event to update bid value and current player for all clients in the room
    io.to(roomNo).emit('updateBid', { playerName: nextPlayer, amount })
  })


})





httpServer.listen(8000);
