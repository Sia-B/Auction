import { useState } from 'react'
import React from 'react'
import './game.css'

const Game = () => {
    const [bidValue, setBidValue] = useState(0);
    const [player1Balance, setPlayer1Balance] = useState(10000);
    const [player2Balance, setPlayer2Balance] = useState(10000);
    const [paintingValue, setPaintingValue] = useState(null);
  const [auctionStarted, setAuctionStarted] = useState(false);

  const handleBid = (amount) => {
    setBidValue(bidValue + amount);
  };

  const generatePainting = () => {
    const min = 100;
    const max = 500;
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setPaintingValue(randomValue);
  };

  const startAuction = () => {
    setAuctionStarted(true);
    generatePainting();
  };

  return (
    <div className="gameBackground">
        <div className="bidArea">
        {!auctionStarted && <button className='start-auction' onClick={startAuction}>START AUCTION</button>}
        <h2 className='painting-value'>Painting value: ${paintingValue}</h2>
        <div className="painting"></div>
        <h2 className='bid-value'>Bid Value: ${bidValue}</h2>
      </div>
        <div className="players">
            <div className="player1">
            <h1>Player1</h1>
            <input type="text" name="player1-bid" id="player1-bid" />
            <div className="bid-buttons">
            <button className='bid' onClick={() => handleBid(1)}>Bid $1</button>
            <button className='bid' onClick={() => handleBid(10)}>Bid $10</button>
            <button className='bid' onClick={() => handleBid(100)}>Bid $100</button>
            </div>
            <div className="withdraw-btn">
            <button className='withdraw' onClick={generatePainting}>Withdraw</button>
          </div>
          <h3>Balance: ${player1Balance}</h3>
            </div>
            <div className="player2">
            <h1>Player2</h1>
            <input type="text" name="player2-bid" id="player2-bid" />
            <div className="bid-buttons">
            <button className='bid' onClick={() => handleBid(1)}>Bid $1</button>
            <button className='bid' onClick={() => handleBid(10)}>Bid $10</button>
            <button className='bid' onClick={() => handleBid(100)}>Bid $100</button>
            </div>
            <div className="withdraw-btn">
            <button className='withdraw' onClick={generatePainting}>Withdraw</button>
          </div>
          <h3>Balance: ${player2Balance}</h3>
            </div>
        </div>
    </div>
  )
}

export default Game