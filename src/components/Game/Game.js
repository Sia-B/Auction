import { useState, useEffect } from 'react'
import React from 'react'
import './game.css'
import PaintingItem from '../Paintings/PaintingItem'
import { useLocation } from 'react-router-dom';
import { io } from "socket.io-client";


const Game = () => {
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const roomNo = new URLSearchParams(location.search).get('room');
  const playerName = new URLSearchParams(location.search).get('player');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  useEffect(() => {
    let isFirstPlayer = true;
    const newSocket = io("http://localhost:8000", {
      autoConnect: true
    });

    // Handle socket events
    newSocket.on("connect", () => {
      console.log("Connected to server");
      // Join the room when connected
      newSocket.emit("joinRoom", { playerName, roomNo });
    });

    newSocket.on("playerJoined",  (otherPlayerName) => {
      console.log(`${playerName} has joined the room`);
    });

    newSocket.on("currentPlayers", (playerNames) => {
      const uniquePlayerNames = Array.from(new Set(playerNames))
      console.log("Received current players:", uniquePlayerNames);
      setPlayer1Name(uniquePlayerNames[0] || ''); // Set to empty string if undefined
      setPlayer2Name(uniquePlayerNames[1] || ''); // Set to empty string if undefined
    });

    setSocket(newSocket);

    // Clean up function
    return () => {
      // Disconnect socket when unmounting
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomNo, playerName]);



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
    setBidValue(bidValue + amount);
    const cplayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    setCurrentPlayer(cplayer)

  };

  const generatePainting = (player) => {
    const min = 100;
    const max = 500;
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setPaintingValue(randomValue);
    const newId = (paintingId % 15) + 1;
  setPaintingId(newId);
    /*const randomId = Math.floor(Math.random() * 15) + 1;
    setPaintingId(randomId);*/
   const cplayer = currentPlayer === 'player1' ? 'player2' : 'player1';
   const newBalance = player === 'player1' ? player2Balance - bidValue : player1Balance - bidValue;

  // Update the state
  if (player === 'player1') {
    setPlayer2Balance(newBalance);
     setPlayer2Paintings([...player2Paintings, { id: paintingId, value: randomValue }]);
     console.log(player2Paintings)
  } else if (player === 'player2') {
    setPlayer1Balance(newBalance);
    setPlayer1Paintings([...player1Paintings, { id: paintingId, value: randomValue }]);
    console.log(player1Paintings)
  }
  setBidValue(0)
  setCurrentPlayer(cplayer)
  setPaintingsDisplayed(paintingsDisplayed + 1);
  if (paintingsDisplayed === 9) {
    determineWinner();
    setAuctionStarted(false)
    
  }
}
  
const determineWinner = () => {
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
};

  const startAuction = () => {
    setAuctionStarted(true);
    generatePainting();
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

  /*const nextPainting = () => {
    setCurrentPaintingIndex((prevIndex) => (prevIndex + 1) % (player1Paintings.length || player2Paintings.length));
    console.log(currentPaintingIndex)
  };

  const previousPainting = () => {
    setCurrentPaintingIndex((prevIndex) => (prevIndex - 1 + (player1Paintings.length || player2Paintings.length)) % (player1Paintings.length || player2Paintings.length));
    console.log(currentPaintingIndex)
  };*/
  const nextPainting = () => {
    setCurrentPaintingIndex((prevIndex) => (prevIndex + 1) % (showCollectionForPlayer === 'player1' ? player1Paintings.length : player2Paintings.length));
  };
  
  const previousPainting = () => {
    setCurrentPaintingIndex((prevIndex) => (prevIndex - 1 + (showCollectionForPlayer === 'player1' ? player1Paintings.length : player2Paintings.length)) % (showCollectionForPlayer === 'player1' ? player1Paintings.length : player2Paintings.length));
  };

  const [imageSrc, setImageSrc] = useState(null);
  
    useEffect(() => {
      // Dynamically import the image based on the painting id
      import(`../../paintings/painting${paintingId}.jpeg`)
        .then((image) => {
          // Set the image source once it's loaded
          setImageSrc(image.default);
        })
        .catch((error) => {
          console.error('Error loading image:', error);
        });
    }, [paintingId]);


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
            {player1Paintings.length !==0 && <button className="collection-button" onClick={()=>{openCollection('player1')}}>Collections</button>}
            {showCollectionForPlayer === 'player1' && (
            <div className="collection-view">
              <button className="close-button" onClick={()=>{closeCollection('player1')}}>Close</button>
              <button className="arrow-button" onClick={previousPainting}>&lt;</button>
              <PaintingItem painting={player1Paintings[currentPaintingIndex]} />
              <button className="arrow-button" onClick={nextPainting}>&gt;</button>
            </div>
          )}
            <input type="text" name="player1-bid" id="player1-bid" />
            <div className="bid-buttons">
             <button className='bid' onClick={() => handleBid(1)} disabled={currentPlayer !== 'player1' || auctionStarted === 'false'}>Bid $1</button>
             <button className='bid' onClick={() => handleBid(10)} disabled={currentPlayer !== 'player1' || auctionStarted === 'false'}>Bid $10</button>
             <button className='bid' onClick={() => handleBid(100)} disabled={currentPlayer !== 'player1'|| auctionStarted === 'false'}>Bid $100</button>
            </div>
            <div className="withdraw-btn">
            <button className='withdraw' onClick={()=>{generatePainting('player1')}}>Withdraw</button>
          </div>
          <h3>Balance: ${player1Balance}</h3>
            </div>
            <div className="player2">
            <h1>{player2Name}</h1>
          {player2Paintings.length !==0 && <button className="collection-button" onClick={()=>{openCollection('player2')}}>Collections</button>}
          {showCollectionForPlayer === 'player2' && (
            <div className="collection-view">
              <button className="close-button" onClick={()=>{closeCollection('player2')}}>Close</button>
              <button className="arrow-button" onClick={previousPainting}>&lt;</button>
              <PaintingItem painting={player2Paintings[currentPaintingIndex]} />
              <button className="arrow-button" onClick={nextPainting}>&gt;</button>
            </div>
          )}
            <input type="text" name="player2-bid" id="player2-bid" />
            <div className="bid-buttons">
             <button className='bid' onClick={() => handleBid(1)}  disabled={currentPlayer !== 'player2' || auctionStarted === 'false'}>Bid $1</button>
             <button className='bid' onClick={() => handleBid(10)} disabled={currentPlayer !== 'player2' || auctionStarted === 'false'}>Bid $10</button>
             <button className='bid' onClick={() => handleBid(100)} disabled={currentPlayer !== 'player2' || auctionStarted === 'false'}>Bid $100</button>
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