import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartGameButton from './components/StartGameButton/StartGameButton';
import Game from './components/Game/Game';
import StartGameState from './components/StartGameButton/StartGameState';

function App() {
  return (
    <div className="App">
      <StartGameState>
     <Router>
      <Routes>
        <Route exact path="/" element={<StartGameButton/>} />
        <Route exact path="/game" element={<Game/>} />
      </Routes>
     </Router>   
     </StartGameState>

    </div>
  );
}

export default App;
