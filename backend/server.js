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
    const room = rooms[roomNo];
    const currentPlayer = room.players.find(player => player.name === playerName);
    const nextPlayer = currentPlayer.role === 'player1' ? 'player2' : 'player1';
    console.log(nextPlayer)
  
    // Emit event to update bid value and current player for all clients in the room
    io.to(roomNo).emit('updateBid', { playerName: nextPlayer, amount })
  })

  socket.on('sendPlayerData', ({ roomNo, player, balance, paintings, usedPaintingIds}) => {
    console.log(balance)
    const otherPlayer = player === 'player1' ? 'player2' : 'player1';
    const bidBalance = 0;
    if (rooms[roomNo]) {
        /*if (player === 'player1') {
            rooms[roomNo].player2Balance = balance;
            rooms[roomNo].player2Paintings = paintings;
        } else {
            rooms[roomNo].player1Balance = balance;
            rooms[roomNo].player1Paintings = paintings;
        }*/rooms[roomNo][`${otherPlayer}Balance`] = balance[otherPlayer];
    rooms[roomNo][`${otherPlayer}Paintings`] = paintings[otherPlayer];
    rooms[roomNo][`${player}Balance`] = balance[player];
    rooms[roomNo][`${player}Paintings`] = paintings[player];

        console.log("Player1paintingsB:", rooms[roomNo].player1Paintings, "Balance:", rooms[roomNo].player1Balance)
        console.log("Player2paintingsB:", rooms[roomNo].player2Paintings, "Balance:", rooms[roomNo].player2Balance)

        io.to(roomNo).emit('updatePlayerData', { player: 'player1', balance: rooms[roomNo].player1Balance, paintings: rooms[roomNo].player1Paintings, bidBalance });
        io.to(roomNo).emit('updatePlayerData', { player: 'player2', balance: rooms[roomNo].player2Balance, paintings: rooms[roomNo].player2Paintings, bidBalance });
        /*if (rooms[roomNo].player1Paintings && rooms[roomNo].player1Paintings.length === 9 && rooms[roomNo].player2Paintings && rooms[roomNo].player2Paintings.length === 9) {
            determineWinnerAndBroadcast(roomNo);
        }*/
        /*if (usedPaintingIds.length === 9) {
            determineWinnerAndBroadcast(roomNo)
        }*/
    }
    
  })

  socket.on('requestWinnerDetermination', (roomNo) => {
    /*determineWinnerAndBroadcast(roomNo);*/
    console.log("Req winner called")
  });
  
  const determineWinnerAndBroadcast = (roomNo) => {
    const player1PaintingValue = rooms[roomNo].player1Paintings.reduce((acc, painting) => acc + painting.value, 0);
    const player2PaintingValue = rooms[roomNo].player2Paintings.reduce((acc, painting) => acc + painting.value, 0);
    const player1Total = rooms[roomNo].player1Balance + player1PaintingValue;
    const player2Total = rooms[roomNo].player2Balance + player2PaintingValue;

    let winner;
    if (player1Total > player2Total) {
      winner = "player1";
    } else if (player2Total > player1Total) {
      winner = "player2";
    } else {
      winner = "draw";
    }

    io.to(roomNo).emit("gameResult", { winner });
  }
  
  
  
  socket.on('newPainting', ({ roomNo, paintingId, paintingValue }) => {
    // Broadcast the new painting to all players in the room
    io.to(roomNo).emit('receiveNewPainting', { paintingId, paintingValue });
  })
})






httpServer.listen(8000);
