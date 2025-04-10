import Board from './components/Board';
import UpcomingBlocks from './components/UpcomingBlocks';
import HighScores from './components/HighScores';
import GameOverScreen from './components/GameOverScreen';
import { useTetris } from './hooks/useTetris';
import './types';

function App() {
  const { board, startGame, isPlaying, score, upcomingBlocks, gameOver, highScores, saveHighScore } = useTetris();

  return (
      <div className='App'>
        <h1>Tetris!</h1>
        <Board currentBoard={board}/>
        <div className='controls'>
          <HighScores scores={highScores} />
          <h2>Current Score: {score}</h2>
          {isPlaying ? (
            <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
          ) : (
              <button onClick={startGame}>New Game</button>
          )}
          {gameOver && <GameOverScreen score={score} onSaveScore={saveHighScore}/> }
        </div>
      </div>
  );
}

export default App
