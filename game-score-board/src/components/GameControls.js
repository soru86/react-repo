import React, { useState } from 'react';
import './GameControls.css';

function GameControls({ onAddPlayer, onResetScores, onResetGame, playerCount }) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName);
      setPlayerName('');
    }
  };

  return (
    <div className="GameControls">
      <h2>Game Controls</h2>
      <form onSubmit={handleSubmit} className="add-player-form">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="player-input"
          maxLength={30}
        />
        <button type="submit" className="btn btn-primary">
          Add Player
        </button>
      </form>
      <div className="control-buttons">
        <button 
          onClick={onResetScores} 
          className="btn btn-secondary"
          disabled={playerCount === 0}
        >
          Reset Scores
        </button>
        <button 
          onClick={onResetGame} 
          className="btn btn-danger"
          disabled={playerCount === 0}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default GameControls;

