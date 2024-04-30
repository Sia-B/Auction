import { useState, useEffect, useRef, useContext } from 'react'
import React from 'react'
import './game.css'
import PaintingItem from '../Paintings/PaintingItem'
import { useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import StartGameContext from '../../components/StartGameButton/StartGameContext'


const Game = () => {
  const {playerName, roomNo, setPlayerName, setRoomNo} = useContext(StartGameContext)
  const [socket, setSocket] = useState(null);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [usedPaintingIds, setUsedPaintingIds] = useState([])

  const [bidValue, setBidValue] = useState(0);
    const [player1Balance, setPlayer1Balance] = useState(3000);
    const [player2Balance, setPlayer2Balance] = useState(3000);
    const [paintingValue, setPaintingValue] = useState(null);
  const [auctionStarted, setAuctionStarted] = useState(false);
   const [paintingId, setPaintingId] = useState(0);
   const [player1Paintings, setPlayer1Paintings] = useState([]);
    const [player2Paintings, setPlayer2Paintings] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState('player2');
    const [paintingsDisplayed, setPaintingsDisplayed] = useState(0);
  const [winner, setWinner] = useState(null);

  const isMounted = useRef(false)

  useEffect(() => {
    console.log("Game mounted")
    /*console.log(playerName, roomNo)*/
    if (!isMounted.current) {
    const newSocket = io("http://localhost:8000", {
      autoConnect: true
    
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      if (playerName && roomNo) {
        newSocket.emit("joinRoom", { playerName, roomNo }); // Emit event with playerName and roomNo
      } else {
        console.error("Player name or room number not provided.");
      }
    });
      newSocket.on("currentPlayers", (data) => {
        console.log("current players:", data)
        try {
          if (Array.isArray(data) && data.length > 0) {
            data.forEach(player => {
              if (player.name && player.role) {
                if (player.role === 'player1') {
                  setPlayer1Name(player.name);
                } else if (player.role === 'player2') {
                  setPlayer2Name(player.name);
                }
              } else {
                console.error("Invalid player data:", player);
              }
            });
          } else {
            console.error("Invalid data format or empty data array:", data);
          }
        } catch (error) {
          console.error("Error processing player data:", error);
        }
      
    
   
      
    });

    setSocket(newSocket);
    isMounted.current = true

    // Clean up function
    return () => {
      // Disconnect socket when unmounting
      if (socket) {
        socket.disconnect();
      }
      }
    };
  }, [socket]);



    
  //
 
  //
  /*useEffect(() => {
    if (playerName && player1Name === '') {
      setPlayer1Name(playerName);
    } else {
      setPlayer2Name(playerName);
    }
  }, [playerName, player1Name, player2Name]);*/


    const [showCollectionForPlayer, setShowCollectionForPlayer] = useState(null); 
  const [currentPaintingIndex, setCurrentPaintingIndex] = useState(0); // State to track the index of the current painting being viewed


  const handleBid = (amount) => {
    const newTotalBidValue = bidValue + amount; // Calculate the new total bid value
    setBidValue(newTotalBidValue)
    socket.emit('placeBid', { playerName, roomNo, amount: newTotalBidValue });
   setCurrentPlayer(currentPlayer === 'player1' ? 'player2':"player1")
  };
  useEffect(() => {
    if (socket) {
      socket.on("updateBid", ({ playerName, amount }) => {
        setCurrentPlayer(playerName);
        setBidValue(amount)
      });
    }
  }, [socket])

  const generatePainting = (player) => {
    const min = 100;
    const max = 500;
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setPaintingValue(randomValue);
    const minId = 0; // Minimum painting ID
  const maxId = 9; // Maximum painting ID
  /*const newId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
    setPaintingId(newId);*/
      // Keep generating until a unique painting ID is found
      let newId
  do {
    newId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
  } while (usedPaintingIds.includes(newId)); // Ensure the ID is unique

  // Once a unique ID is found, add it to the list of used IDs
  console.log(newId)
  setUsedPaintingIds(prevIds => [...prevIds, newId])
  setPaintingId(newId);
    
    const currentPlayerBalance = player === 'player1' ? player2Balance : player1Balance;
    const newBalance = currentPlayerBalance - bidValue;
    console.log("newbalance", newBalance)
  
    // Update the state and emit player data to the server
    if (player === 'player1') {
      setPlayer1Balance(newBalance);
      if(player1Paintings && player1Paintings.length !== 0 ){
      setPlayer1Paintings([...player1Paintings, { id: paintingId, value: randomValue }]);
      }
    } else if (player === 'player2') {
      setPlayer2Balance(newBalance);
      if(player2Paintings && player2Paintings.length !== 0 ){
      setPlayer2Paintings([...player2Paintings, { id: paintingId, value: randomValue }]);
      }
    }

    socket.emit('newPainting', {
      roomNo,
      paintingId: newId,
      paintingValue: randomValue
    });
    
    socket.on('receiveNewPainting', ({ paintingId, paintingValue }) => {
      // Update the UI with the new painting information
      setPaintingId(paintingId);
      setPaintingValue(paintingValue);

      // Dynamically import the image based on the new painting id
      import(`../../paintings/painting${paintingId}.jpeg`)
        .then((image) => {
          // Set the image source once it's loaded
          setImageSrc(image.default);
        })
        .catch((error) => {
          console.error('Error loading image:', error);
        });
    });

    
  
    // Emit player data to the server
    if(player){
      console.log("newB",newBalance)
    socket.emit('sendPlayerData', {
      roomNo,
      player,
      balance: {
        player1: player === 'player1' ? player1Balance: newBalance,
        player2: player === 'player2' ? player2Balance: newBalance
      },
      paintings: {
        player1: player === 'player2' ? [...player1Paintings, { id: newId, value: randomValue }] : [...player1Paintings],
        player2: player === 'player1' ? [...player2Paintings, { id: newId, value: randomValue }] : [...player2Paintings]
      },
      usedPaintingIds
    });
    }
    // Update the state locally
    /*if (player === 'player1') {
      setCurrentPlayer('player2');
    } else {
      setCurrentPlayer('player1');
    }*/
    socket.emit('placeBid', { playerName, roomNo, amount: 0 });
    /*setBidValue(0);*/
    /*setPaintingsDisplayed(paintingsDisplayed + 1);
    if (paintingsDisplayed === 9) {
      socket.emit('requestWinnerDetermination', roomNo);
    }*/
    console.log(usedPaintingIds, "length:", usedPaintingIds.length)
    if (usedPaintingIds.length == 2) {
      // Emit event to the server to trigger the determination of the winner
      socket.emit('requestWinnerDetermination', roomNo);
    }
    /*if (paintingsDisplayed === 9) {
      determineWinner();
      setAuctionStarted(false);
    }*/

}
useEffect(() => {
  if (socket) {

socket.on('updatePlayerData', ({ player, balance, paintings, bidBalance }) => {
  if (player === 'player1') {
    setPlayer1Balance(balance);
    setPlayer1Paintings(paintings);
    setCurrentPlayer(player)
    setBidValue(bidBalance)
  } else if (player === 'player2') {
    setPlayer2Balance(balance);
    setPlayer2Paintings(paintings);
    setCurrentPlayer(player)
    setBidValue(bidBalance)
  }
});
  }
})
  
/*const determineWinner = () => {
  const player1PaintingValue = player1Paintings.reduce((acc, painting) => acc + painting.value, 0);
  const player2PaintingValue = player2Paintings.reduce((acc, painting) => acc + painting.value, 0);
  const player1Total = player1Balance + player1PaintingValue;
  const player2Total = player2Balance + player2PaintingValue;
  if (player1Total > player2Total) {
    setWinner('player1');
  } else if (player2Total > player1Total) {
    setWinner('player2');
  } else {
    setWinner('draw');
  }
  socket.emit('gameResult', { winner });
};*/
 socket?.on("gameResult", ({ winner }) => {
  setWinner(winner);
});

  const startAuction = () => {
    
    socket.emit("startAuction", { playerName, roomNo })
    socket.on("bothPlayersStartedAuction", () => {
      generatePainting();
      setAuctionStarted(true);
      console.log("both player ready")
    })
    /*generatePainting();*/
    setWinner(null)
    setPlayer1Balance(3000)
    setPlayer2Balance(3000)
    setPlayer1Paintings([])
    setPlayer2Paintings([])
  }

  const openCollection = (player) => {
    setShowCollectionForPlayer(player);
  };

  const closeCollection = (player) => {
    setShowCollectionForPlayer(null);
    setCurrentPaintingIndex(0); // Reset the current painting index when closing the collection
  };

  const nextPainting = () => {
    setCurrentPaintingIndex((prevIndex) => (prevIndex + 1) % (showCollectionForPlayer === 'player1' ? player1Paintings.length : player2Paintings.length));
  };
  
  const previousPainting = () => {
    setCurrentPaintingIndex((prevIndex) => (prevIndex - 1 + (showCollectionForPlayer === 'player1' ? player1Paintings.length : player2Paintings.length)) % (showCollectionForPlayer === 'player1' ? player1Paintings.length : player2Paintings.length));
  };

  const [imageSrc, setImageSrc] = useState(null);
  
    /*useEffect(() => {
      // Dynamically import the image based on the painting id
      import(`../../paintings/painting${paintingId}.jpeg`)
        .then((image) => {
          // Set the image source once it's loaded
          setImageSrc(image.default);
        })
        .catch((error) => {
          console.error('Error loading image:', error);
        });
    }, [paintingId]);*/


  return (
    <div className="gameBackground">
        <div className="bidArea">
        {!auctionStarted && <button className='start-auction' onClick={startAuction}>START AUCTION</button>}
        <h2 className='painting-value'>Painting value: ${paintingValue}</h2>
        {auctionStarted && <div className="painting"><img src={imageSrc} alt="" className='painting-image'/></div>}
        {winner && <h2 className='winner'>{winner === 'draw' ? 'It\'s a draw!' : `${winner.toUpperCase()} wins the game!`}</h2>}
        <h2 className='bid-value'>Bid Value: ${bidValue}</h2>
      </div>
        <div className="players">
            <div className="player1">
            <h1>{player1Name}</h1>
            {player1Paintings && player1Paintings.length !==0 && <button className="collection-button" onClick={()=>{openCollection('player1')}}>Collections</button>}
            {showCollectionForPlayer === 'player1' && player1Paintings.length > 0 && (
            <div className="collection-view">
              <button className="close-button" onClick={()=>{closeCollection('player1')}}>Close</button>
              <button className="arrow-button" onClick={previousPainting}>&lt;</button>
              <PaintingItem painting={player1Paintings[currentPaintingIndex]} />
              <button className="arrow-button" onClick={nextPainting}>&gt;</button>
            </div>
          )}
            <input type="text" name="player1-bid" id="player1-bid" />
            <div className="bid-buttons">
             <button className='bid' onClick={() => handleBid(1)} disabled={currentPlayer !== 'player1' || auctionStarted === false || playerName !== player1Name}>Bid $1</button>
             <button className='bid' onClick={() => handleBid(10)} disabled={currentPlayer !== 'player1' || auctionStarted === false || playerName !== player1Name}>Bid $10</button>
             <button className='bid' onClick={() => handleBid(100)} disabled={currentPlayer !== 'player1'|| auctionStarted === false || playerName !== player1Name}>Bid $100</button>
            </div>
            <div className="withdraw-btn">
            <button className='withdraw' onClick={()=>{generatePainting('player1')}}>Withdraw</button>
          </div>
          <h3>Balance: ${player1Balance}</h3>
            </div>
            <div className="player2">
            <h1>{player2Name}</h1>
          {player2Paintings && player2Paintings.length !==0 && <button className="collection-button" onClick={()=>{openCollection('player2')}}>Collections</button>}
          {showCollectionForPlayer === 'player2' && player2Paintings.length > 0 && (
            <div className="collection-view">
              <button className="close-button" onClick={()=>{closeCollection('player2')}}>Close</button>
              <button className="arrow-button" onClick={previousPainting}>&lt;</button>
              <PaintingItem painting={player2Paintings[currentPaintingIndex]} />
              <button className="arrow-button" onClick={nextPainting}>&gt;</button>
            </div>
          )}
            <input type="text" name="player2-bid" id="player2-bid" />
            <div className="bid-buttons">
             <button className='bid' onClick={() => handleBid(1)}  disabled={currentPlayer !== 'player2' || auctionStarted === false || playerName !== player2Name}>Bid $1</button>
             <button className='bid' onClick={() => handleBid(10)} disabled={currentPlayer !== 'player2' || auctionStarted === false || playerName !== player2Name}>Bid $10</button>
             <button className='bid' onClick={() => handleBid(100)} disabled={currentPlayer !== 'player2' || auctionStarted === false || playerName !== player2Name}>Bid $100</button>
            </div>
            <div className="withdraw-btn">
            <button className='withdraw' onClick={()=>{generatePainting('player2')}}>Withdraw</button>
          </div>
          <h3>Balance: ${player2Balance}</h3>
            </div>
        </div>
        
    </div>
  )
}

export default Game