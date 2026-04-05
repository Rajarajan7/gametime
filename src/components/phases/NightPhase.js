import React, { useState } from 'react';

const NightPhase = ({ gameState, onSubmit }) => {
  const [actions, setActions] = useState({
    mafiaKill: '',
    godfatherBlock: '',
    detectiveCheck: '',
    ramboKill: '',
    angelSave: ''
  });

  const handleSelectChange = (key, value) => {
    setActions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(actions);
  };

  const alivePlayers = gameState.players.filter(p => p.alive);

  const getRoleEmoji = (role) => {
    const emojis = {
      godfather: '👑',
      mafia: '🔫',
      detective: '🔍',
      angel: '😇',
      bestfriends: '👯',
      rambo: '💪',
      villagers: '🌾'
    };
    return emojis[role] || '❓';
  };

  return (
    <div className="phase-container">
      <h3 className="phase-title">🌙 Night Phase - Round {gameState.round}</h3>
      <p className="phase-description">The sun sets. Special roles take their actions.</p>

      <div className="players-display">
        <h4>Players Alive</h4>
        <div className="players-grid">
          {alivePlayers.map(player => (
            <div key={player.id} className="player-badge">
              <div className="player-badge-name">{player.name}</div>
              <div className="player-badge-role">{getRoleEmoji(player.role)} {player.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="actions-container">
        {(gameState.selectedRoles.godfather || gameState.selectedRoles.mafia) && gameState.players.some(p => (p.role === 'mafia' || p.role === 'godfather') && p.alive) && (
          <div className="action-section">
            <h4>🔫 Mafia & Godfather - Who to kill?</h4>
            <select
              className="action-select"
              value={actions.mafiaKill}
              onChange={(e) => handleSelectChange('mafiaKill', e.target.value)}
            >
              <option value="">-- Select target --</option>
              {alivePlayers
                .filter(p => p.role !== 'godfather' && p.role !== 'mafia')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {gameState.selectedRoles.godfather && gameState.players.find(p => p.role === 'godfather' && p.alive) && (
          <div className="action-section">
            <h4>👑 Godfather - Who to block?</h4>
            <p className="action-description">Block a villager's role (cannot block other Mafia members).</p>
            <select
              className="action-select"
              value={actions.godfatherBlock}
              onChange={(e) => handleSelectChange('godfatherBlock', e.target.value)}
            >
              <option value="">-- No block --</option>
              {alivePlayers
                .filter(p => p.role !== 'godfather' && p.role !== 'mafia')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {gameState.selectedRoles.detective && gameState.players.find(p => p.role === 'detective' && p.alive) && (
          <div className="action-section">
            <h4>🔍 Detective - Who to investigate?</h4>
            <select
              className="action-select"
              value={actions.detectiveCheck}
              onChange={(e) => handleSelectChange('detectiveCheck', e.target.value)}
            >
              <option value="">-- Select target --</option>
              {alivePlayers
                .filter(p => p.role !== 'detective')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {gameState.selectedRoles.angel && gameState.angelSaves < 1 && gameState.players.find(p => p.role === 'angel' && p.alive) && (
          <div className="action-section">
            <h4>😇 Angel - Choose who to save?</h4>
            <p className="action-description">Choose one player to save. If that player is attacked by Mafia, they will be saved!</p>
            <select
              className="action-select"
              value={actions.angelSave}
              onChange={(e) => handleSelectChange('angelSave', e.target.value)}
            >
              <option value="">-- Select target to save --</option>
              {alivePlayers
                .filter(p => p.role !== 'angel')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({getRoleEmoji(p.role)} {p.role})
                  </option>
                ))}
            </select>
          </div>
        )}

        {gameState.selectedRoles.rambo && gameState.totalRamboKills === 0 && gameState.players.find(p => p.role === 'rambo' && p.alive) && (
          <div className="action-section">
            <h4>💪 Rambo - Execute who? (Can only kill once!)</h4>
            <select
              className="action-select"
              value={actions.ramboKill}
              onChange={(e) => handleSelectChange('ramboKill', e.target.value)}
            >
              <option value="">-- Select target --</option>
              {alivePlayers
                .filter(p => p.role !== 'rambo')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        )}
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

      {gameState.savedByAngel !== null && (
        <div className="angel-saved-info">
          <h4>😇 Angel Protection</h4>
          <p>
            Angel saved: <strong>{gameState.players.find(p => p.id === gameState.savedByAngel)?.name}</strong>
          </p>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Night Actions
      </button>
    </div>
  );
};

export default NightPhase;
