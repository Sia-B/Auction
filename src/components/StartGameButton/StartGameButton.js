import React from 'react'
import { Link } from 'react-router-dom';
import './startGameButton.css'

const StartGameButton = () => {
  return (
    <div><div className="opening-screen">
    <Link to= '/game'><button type="button" className='start-btn' name='start-btn'>START GAME</button></Link>
  </div></div>
  )
}

export default StartGameButton