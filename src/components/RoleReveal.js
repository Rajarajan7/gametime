import React from 'react';

const RoleReveal = ({ players, onContinue }) => {
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

  const getRoleDescription = (role) => {
    const descriptions = {
      godfather: 'Commands the Mafia and can block roles',
      mafia: 'Kills players at night',
      detective: 'Investigates players to find Mafia',
      angel: 'Saves one random attacked player',
      bestfriends: 'Die together if one is eliminated',
      rambo: 'Can kill one person during the game',
      villagers: 'Must find and eliminate the Mafia'
    };
    return descriptions[role] || '';
  };

  return (
    <div className="role-reveal-container">
      <h2>🎭 Roles Have Been Assigned!</h2>
      <p className="role-reveal-subtitle">Review the player roles below:</p>

      <div className="role-reveal-grid">
        {players.map((player) => (
          <div key={player.id} className="role-reveal-card">
            <div className="role-reveal-emoji">{getRoleEmoji(player.role)}</div>
            <div className="role-reveal-name">{player.name}</div>
            <div className="role-reveal-role">{player.role}</div>
            <div className="role-reveal-description">{getRoleDescription(player.role)}</div>
          </div>
        ))}
      </div>

      <div className="role-reveal-legend">
        <h3>Team Roles:</h3>
        <div className="legend-grid">
          <div className="legend-item mafia-team">
            <strong>🔴 Mafia Team:</strong> 👑 Godfather, 🔫 Mafia
          </div>
          <div className="legend-item village-team">
            <strong>🟢 Village Team:</strong> 🌾 Villagers, 🔍 Detective, 😇 Angel, 💪 Rambo, 👯 Bestfriends
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onContinue}>
        Start Game
      </button>
    </div>
  );
};

export default RoleReveal;
