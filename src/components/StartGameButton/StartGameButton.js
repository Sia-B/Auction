import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './startGameButton.css'
import { io } from "socket.io-client";
import { useState } from 'react';



const StartGameButton = () => {
  const [socket, setSocket] = useState(null)
  const [startGame, setStartGame] = useState(false)
  const [toggleStartGame, setToggleStartGame] = useState(false)
  const [playerName, setPlayerName] = useState("");
  const [roomNo, setRoomNo] = useState("");

  const navigate = useNavigate();


  const playOnline = (e) =>{
    e.preventDefault();
    /*const newSocket = io("http://localhost:8000", {
      autoConnect: true
    });
    newSocket.emit("joinRoom", { playerName, roomNo });
    
    newSocket.on("roomJoined", (roomNo) => {
      // Redirect to the game page with room information using history.push
      navigate(`/game?room=${roomNo}`);
    });

    newSocket.on("playerJoined", (playerName) => {
      // Update UI to indicate that a new player has joined
      console.log("playerjoined")
      console.log(playerName);
    });

    setSocket(newSocket)
    setStartGame(true)*/
      navigate(`/game?room=${roomNo}&player=${playerName}`);
  }

  const toggleStart = () =>{
    setToggleStartGame(true)
  } 

  const handleNameChange = (event) => {
    setPlayerName(event.target.value)
  };

  const handleRoomNoChange = (event) => {
    setRoomNo(event.target.value)
  };

  return (
    <div><div className="opening-screen">
      {!toggleStartGame ? <button type="button" className='start-btn' name='start-btn' onClick={toggleStart}>START GAME</button>:
      <form className="player-details" ><h3>Enter your name:</h3><input type="text" name="player-name" id="player-name" value={playerName} onChange={handleNameChange} required/>
      <h3>Enter room no:</h3><input type="text" name="room-no" id="room-no"  value={roomNo} onChange={handleRoomNoChange} required/>
      {(playerName.trim() !== '' && roomNo.trim() !== '') && (
      <button type="submit" className='start-btn' name='go-btn' onClick={playOnline}>GO!</button>
     )}</form>}
  </div></div>
  )
}

export default StartGameButton