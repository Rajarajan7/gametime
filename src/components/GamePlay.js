import React from 'react';
import NightPhase from './phases/NightPhase';
import DayPhase from './phases/DayPhase';
import Results from './Results';

const GamePlay = ({ gameState, setGameState, onBackToSetup }) => {
  const handleNightSubmit = (actions) => {
    // Convert string IDs to numbers
    const mafiaKillId = actions.mafiaKill ? parseInt(actions.mafiaKill) : null;
    const ramboKillId = actions.ramboKill ? parseInt(actions.ramboKill) : null;
    const detectiveCheckId = actions.detectiveCheck ? parseInt(actions.detectiveCheck) : null;

    const killed = [];
    const saved = [];
    let newLog = [...gameState.gameLog];
    let savedByAngel = gameState.savedByAngel;

    // Angel saves
    const angel = gameState.players.find(p => p.role === 'angel' && p.alive);
    const angelSaveId = actions.angelSave ? parseInt(actions.angelSave) : null;
    if (angel && gameState.angelSaves < 1 && angelSaveId && mafiaKillId === angelSaveId) {
      saved.push(angelSaveId);
      savedByAngel = angelSaveId;
      const savedPlayer = gameState.players.find(p => p.id === angelSaveId);
      if (savedPlayer) newLog.push(`😇 Angel saved ${savedPlayer.name} as planned!`);
    }

    // Mafia kill
    if (mafiaKillId && !saved.includes(mafiaKillId)) {
      const target = gameState.players.find(p => p.id === mafiaKillId);
      if (target) {
        killed.push(mafiaKillId);
        target.alive = false;
        newLog.push(`🔫 ${target.name} (${target.role}) was killed by Mafia!`);

        // Bestfriends die together
        if (target.role === 'bestfriends' && gameState.bestfriendsActive.includes(mafiaKillId)) {
          const friendId = gameState.bestfriendsActive.find(id => id !== mafiaKillId);
          const friend = gameState.players.find(p => p.id === friendId);
          if (friend && friend.alive) {
            killed.push(friendId);
            friend.alive = false;
            newLog.push(`👯 ${friend.name} (bestfriend) also died!`);
          }
        }
      }
    }

    // Rambo kill
    if (ramboKillId && !killed.includes(ramboKillId)) {
      const target = gameState.players.find(p => p.id === ramboKillId);
      if (target) {
        killed.push(ramboKillId);
        target.alive = false;
        newLog.push(`💪 Rambo executed ${target.name}!`);
      }
    }

    // Detective check
    if (detectiveCheckId) {
      const target = gameState.players.find(p => p.id === detectiveCheckId);
      if (target) {
        const isMafia = target.role === 'mafia' || target.role === 'godfather';
        newLog.push(`🔍 Detective found: ${target.name} is ${isMafia ? '🔫 MAFIA' : '🌾 NOT Mafia'}`);
      }
    }

    setGameState(prev => ({
      ...prev,
      phase: 'day',
      killed,
      saved,
      savedByAngel,
      gameLog: newLog,
      angelSaves: gameState.angelSaves + (saved.length > 0 ? 1 : 0),
      totalRamboKills: ramboKillId ? gameState.totalRamboKills + 1 : gameState.totalRamboKills
    }));
  };

  const handleDayVote = (targetId) => {
    const parsedTargetId = typeof targetId === 'string' ? parseInt(targetId) : targetId;
    const target = gameState.players.find(p => p.id === parsedTargetId);
    
    if (!target) return;

    const eliminated = [parsedTargetId];
    let newLog = [...gameState.gameLog];

    target.alive = false;
    newLog.push(`🗳️ ${target.name} (${target.role}) was voted out!`);

    // Bestfriends die together
    if (target.role === 'bestfriends' && gameState.bestfriendsActive.includes(parsedTargetId)) {
      const friendId = gameState.bestfriendsActive.find(id => id !== parsedTargetId);
      const friend = gameState.players.find(p => p.id === friendId);
      if (friend && friend.alive) {
        eliminated.push(friendId);
        friend.alive = false;
        newLog.push(`👯 ${friend.name} (bestfriend) also died!`);
      }
    }

    const newState = {
      ...gameState,
      eliminated,
      gameLog: newLog
    };

    // Check win condition
    const gameResult = checkWinCondition(newState);
    if (gameResult) {
      setGameState(prev => ({
        ...prev,
        phase: 'results',
        gameResult,
        gameLog: newLog
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
        phase: 'night',
        gameLog: newLog
      }));
    }
  };

  const checkWinCondition = (state) => {
    const alivePlayers = state.players.filter(p => p.alive);
    const aliveMafia = alivePlayers.filter(p => p.role === 'mafia').length;
    const aliveGodfather = alivePlayers.filter(p => p.role === 'godfather').length;
    const aliveVillagers = alivePlayers.filter(p => !['mafia', 'godfather'].includes(p.role)).length;

    // All Mafia eliminated
    if (aliveMafia === 0 && aliveGodfather === 0) {
      return { winner: 'Villagers', won: true };
    }

    // All villagers eliminated or Mafia >= Villagers
    if (aliveVillagers === 0 || (aliveMafia + aliveGodfather) >= aliveVillagers) {
      return { winner: 'Mafia', won: false };
    }

    return null;
  };

  return (
    <div className="gameplay-section">
      {gameState.phase === 'night' && (
        <NightPhase
          gameState={gameState}
          onSubmit={handleNightSubmit}
        />
      )}

      {gameState.phase === 'day' && (
        <DayPhase
          gameState={gameState}
          onVote={handleDayVote}
        />
      )}

      {gameState.phase === 'results' && (
        <Results
          gameState={gameState}
          onBackToSetup={onBackToSetup}
        />
      )}

      <button className="btn btn-secondary" onClick={onBackToSetup}>
        Back to Setup
      </button>
    </div>
  );
};

export default GamePlay;
