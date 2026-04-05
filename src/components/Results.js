import React from 'react';

const Results = ({ gameState, onBackToSetup }) => {
  const gameResult = gameState.gameResult || { winner: 'Unknown' };
  const isVillagerWin = gameResult.won;

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
    <div className={`results-container ${isVillagerWin ? 'win' : 'loss'}`}>
      <h2 className="results-title">
        {isVillagerWin ? '🎉 Villagers Win!' : '💀 Mafia Wins!'}
      </h2>
      <p className="results-message">
        {isVillagerWin
          ? 'The Mafia has been eliminated! The village is safe!'
          : 'The Mafia has taken over the village. Game Over!'}
      </p>

      <div className="results-content">
        <div className="final-players">
          <h3>Final Player Roles</h3>
          <div className="players-grid">
            {gameState.players.map(player => (
              <div key={player.id} className="player-card">
                <div className="player-card-name">{player.name}</div>
                <div className="player-card-role">
                  {getRoleEmoji(player.role)} {player.role}
                </div>
                <div className={`player-card-status ${player.alive ? 'alive' : 'dead'}`}>
                  {player.alive ? '✅ Alive' : '❌ Dead'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-statistics">
          <h3>Game Statistics</h3>
          <ul className="stats-list">
            <li>
              <strong>Rounds Played:</strong> {gameState.round}
            </li>
            <li>
              <strong>Players Eliminated by Vote:</strong> {gameState.eliminated?.length || 0}
            </li>
            <li>
              <strong>Players Killed at Night:</strong> {gameState.killed?.length || 0}
            </li>
            {gameState.savedByAngel !== null && (
              <li>
                <strong>Saved by Angel:</strong> {gameState.players.find(p => p.id === gameState.savedByAngel)?.name}
              </li>
            )}
            <li>
              <strong>Rambo Kills:</strong> {gameState.totalRamboKills}
            </li>
          </ul>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onBackToSetup}>
        Play Again
      </button>
    </div>
  );
};

export default Results;
