import React from 'react'
import { Link} from 'react-router-dom';
import './startGameButton.css'
import { useState, useContext } from 'react';
import StartGameContext from '../../components/StartGameButton/StartGameContext'


const StartGameButton = () => {
  const {playerName, roomNo, setPlayerName, setRoomNo} = useContext(StartGameContext)
    const [toggleStartGame, setToggleStartGame] = useState(false)
  
    const toggleStart = () =>{
        setToggleStartGame(true)
      } 
      const handleNameChange = (event) => {
        setPlayerName(event.target.value)
        console.log(playerName)
      };
    
      const handleRoomNoChange = (event) => {
        setRoomNo(event.target.value)
        console.log(roomNo)
      }
    return (
        <>
    
        <div><div className="opening-screen">
          {!toggleStartGame ? <button type="button" className='start-btn' name='start-btn' onClick={toggleStart}>START GAME</button>:
          <form className="player-details" ><h3>Enter your name:</h3><input type="text" name="player-name" id="player-name" value={playerName} onChange={handleNameChange} required/>
          <h3>Enter room no:</h3><input type="text" name="room-no" id="room-no"  value={roomNo} onChange={handleRoomNoChange} required/>
          {(playerName.trim() !== '' && roomNo.trim() !== '') && (
          <Link to="/game"><button type="submit" className='start-btn' name='go-btn'>GO!</button></Link>
         )}</form>}
      </div></div>
      </>
      )
}

export default StartGameButton