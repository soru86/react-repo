import React, { useMemo } from 'react';
import './ScoreBoard.css';

function ScoreBoard({ players }) {
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  if (players.length === 0) {
    return (
      <div className="ScoreBoard">
        <h2>Leaderboard</h2>
        <div className="empty-state">
          <p>No players to display</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="ScoreBoard">
      <h2>Leaderboard</h2>
      <div className="leaderboard">
        {sortedPlayers.map((player, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;
          return (
            <div
              key={player.id}
              className={`leaderboard-item ${isTopThree ? 'top-three' : ''} rank-${rank}`}
            >
              <div className="rank">
                <span className="rank-icon">{getRankIcon(rank)}</span>
              </div>
              <div className="player-info">
                <div className="player-name">{player.name}</div>
                <div className="player-score">{player.score} points</div>
              </div>
              <div className="score-bar-container">
                <div
                  className="score-bar"
                  style={{
                    width: `${Math.max(
                      5,
                      (player.score / Math.max(1, sortedPlayers[0].score)) * 100
                    )}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScoreBoard;

