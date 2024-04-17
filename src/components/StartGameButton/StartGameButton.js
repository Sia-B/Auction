import React from 'react'
import { Link } from 'react-router-dom';
import './startGameButton.css'
import { io } from "socket.io-client";
import { useState } from 'react';



const StartGameButton = () => {
  const [socket, setSocket] = useState(null)
  const [startGame, setStartGame] = useState(false)



  const playOnline = () =>{
    const newSocket = io("http://localhost:8000", {
      autoConnect: true
    });
    setSocket(newSocket)
    setStartGame(true)
    }
  return (
    <div><div className="opening-screen">
    <Link to= '/game'><button type="button" className='start-btn' name='start-btn' onClick={playOnline}>START GAME</button>
     </Link>
  </div></div>
  )
}

export default StartGameButton