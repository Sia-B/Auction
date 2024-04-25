import React, { useState } from "react";
import StartGameContext from "./StartGameContext";


const StartGameState = (props) => {


  const [playerName, setPlayerName] = useState("");
  const [roomNo, setRoomNo] = useState("");



  
  return (
    <StartGameContext.Provider value={{ playerName, roomNo, setPlayerName, setRoomNo }}>
        {props.children}
    </StartGameContext.Provider>
);
  
}

export default StartGameState