import React, { useState, useEffect } from 'react';
import './App.css';
import PlayerList from './components/PlayerList';
import ScoreBoard from './components/ScoreBoard';
import GameControls from './components/GameControls';
import GameHistory from './components/GameHistory';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [players, setPlayers] = useLocalStorage('game-players', []);
  const [history, setHistory] = useLocalStorage('game-history', []);

  const addPlayer = (name) => {
    if (!name.trim()) return;
    const newPlayer = {
      id: Date.now(),
      name: name.trim(),
      score: 0,
      createdAt: new Date().toISOString()
    };
    setPlayers([...players, newPlayer]);
    addHistoryEntry(`${newPlayer.name} joined the game`);
  };

  const removePlayer = (id) => {
    const player = players.find(p => p.id === id);
    setPlayers(players.filter(p => p.id !== id));
    if (player) {
      addHistoryEntry(`${player.name} left the game`);
    }
  };

  const updateScore = (id, delta) => {
    setPlayers(players.map(player => {
      if (player.id === id) {
        const newScore = player.score + delta;
        addHistoryEntry(`${player.name}'s score ${delta > 0 ? 'increased' : 'decreased'} by ${Math.abs(delta)} (${player.score} → ${newScore})`);
        return { ...player, score: newScore };
      }
      return player;
    }));
  };

  const resetScores = () => {
    setPlayers(players.map(player => ({ ...player, score: 0 })));
    addHistoryEntry('All scores reset');
  };

  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the entire game? This will remove all players and history.')) {
      setPlayers([]);
      setHistory([]);
    }
  };

  const addHistoryEntry = (action) => {
    const entry = {
      id: Date.now(),
      action,
      timestamp: new Date().toISOString()
    };
    setHistory([entry, ...history].slice(0, 50)); // Keep last 50 entries
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Game Score Board</h1>
        <p>Track scores and compete with friends!</p>
      </header>
      <main className="App-main">
        <div className="App-content">
          <div className="App-left">
            <GameControls 
              onAddPlayer={addPlayer}
              onResetScores={resetScores}
              onResetGame={resetGame}
              playerCount={players.length}
            />
            <PlayerList
              players={players}
              onRemovePlayer={removePlayer}
              onUpdateScore={updateScore}
            />
          </div>
          <div className="App-right">
            <ScoreBoard players={players} />
            <GameHistory history={history} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

