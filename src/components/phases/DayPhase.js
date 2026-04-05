import React, { useState } from 'react';

const DayPhase = ({ gameState, onVote }) => {
  const [selectedVote, setSelectedVote] = useState('');

  const handleVote = () => {
    if (!selectedVote) {
      alert('Please select a player to eliminate');
      return;
    }
    onVote(parseInt(selectedVote));
  };

  const alivePlayers = gameState.players.filter(p => p.alive);

  return (
    <div className="phase-container">
      <h3 className="phase-title">☀️ Day Phase - Round {gameState.round}</h3>
      <p className="phase-description">The sun rises. Time to vote!</p>

      <div className="players-display">
        <h4>Players Alive</h4>
        <div className="players-grid">
          {alivePlayers.map(player => (
            <div key={player.id} className="player-badge">
              <div className="player-badge-name">{player.name}</div>
              <div className="player-badge-role">❓ Unknown Role</div>
            </div>
          ))}
        </div>
      </div>

      <div className="actions-container">
        <div className="action-section">
          <h4>🗳️ Vote to Eliminate</h4>
          <p className="action-description">
            Every player votes to eliminate someone suspected of being Mafia:
          </p>
          <select
            className="action-select"
            value={selectedVote}
            onChange={(e) => setSelectedVote(e.target.value)}
          >
            <option value="">-- Select player to eliminate --</option>
            {alivePlayers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="game-log">
        <h4>Game Log</h4>
        <div className="log-messages">
          {gameState.gameLog.map((msg, idx) => (
            <div key={idx} className="log-message">
              {msg}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleVote}>
        Submit Vote
      </button>
    </div>
  );
};

export default DayPhase;
