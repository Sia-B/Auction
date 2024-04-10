import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartGameButton from './components/StartGameButton/StartGameButton';
import Game from './components/Game/Game';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route exact path="/" element={<StartGameButton/>} />
        <Route exact path="/game" element={<Game/>} />
      </Routes>
     </Router>   

    </div>
  );
}

export default App;
