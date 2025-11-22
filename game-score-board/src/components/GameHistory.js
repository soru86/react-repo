import React from 'react';
import './GameHistory.css';

function GameHistory({ history }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <div className="GameHistory">
        <h2>Game History</h2>
        <div className="empty-state">
          <p>No history yet. Start playing to see activity!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="GameHistory">
      <h2>Game History</h2>
      <div className="history-container">
        {history.map((entry) => (
          <div key={entry.id} className="history-item">
            <div className="history-time">{formatTime(entry.timestamp)}</div>
            <div className="history-action">{entry.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameHistory;

