import React from 'react';
import './PlayerList.css';

function PlayerList({ players, onRemovePlayer, onUpdateScore }) {
  if (players.length === 0) {
    return (
      <div className="PlayerList">
        <h2>Players</h2>
        <div className="empty-state">
          <p>No players yet. Add a player to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="PlayerList">
      <h2>Players ({players.length})</h2>
      <div className="players-container">
        {players.map((player) => (
          <div key={player.id} className="player-card">
            <div className="player-header">
              <h3>{player.name}</h3>
              <button
                onClick={() => onRemovePlayer(player.id)}
                className="remove-btn"
                aria-label={`Remove ${player.name}`}
              >
                ×
              </button>
            </div>
            <div className="player-score">
              <span className="score-label">Score:</span>
              <span className="score-value">{player.score}</span>
            </div>
            <div className="score-controls">
              <button
                onClick={() => onUpdateScore(player.id, -1)}
                className="score-btn score-btn-decrease"
              >
                -1
              </button>
              <button
                onClick={() => onUpdateScore(player.id, -5)}
                className="score-btn score-btn-decrease"
              >
                -5
              </button>
              <button
                onClick={() => onUpdateScore(player.id, 5)}
                className="score-btn score-btn-increase"
              >
                +5
              </button>
              <button
                onClick={() => onUpdateScore(player.id, 1)}
                className="score-btn score-btn-increase"
              >
                +1
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;

