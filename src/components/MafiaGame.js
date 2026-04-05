import React, { useState, useCallback } from 'react';
import Setup from './Setup';
import RoleReveal from './RoleReveal';
import GamePlay from './GamePlay';
import '../styles/MafiaGame.css';

const MafiaGame = () => {
  const [gameState, setGameState] = useState({
    phase: 'setup', // setup, roleReveal, night, day, results
    playerCount: 5,
    players: [],
    selectedRoles: {},
    round: 1,
    gameLog: [],
    eliminated: [],
    saved: [],
    savedByAngel: null,
    killed: [],
    totalRamboKills: 0,
    angelSaves: 0,
    bestfriendsActive: []
  });

  const startGame = useCallback((playerNames, selectedRoles, mafiaCount) => {
    const players = playerNames.map((name, index) => ({
      id: index,
      name,
      role: null,
      alive: true
    }));

    // Assign roles
    const unassignedPlayers = [...players];

    // Godfather
    if (selectedRoles.godfather) {
      const idx = Math.floor(Math.random() * unassignedPlayers.length);
      unassignedPlayers[idx].role = 'godfather';
      unassignedPlayers.splice(idx, 1);
    }

    // Mafia - use mafiaCount parameter
    if (selectedRoles.mafia) {
      for (let i = 0; i < mafiaCount && unassignedPlayers.length > 0; i++) {
        const idx = Math.floor(Math.random() * unassignedPlayers.length);
        unassignedPlayers[idx].role = 'mafia';
        unassignedPlayers.splice(idx, 1);
      }
    }

    // Detective
    if (selectedRoles.detective && unassignedPlayers.length > 0) {
      const idx = Math.floor(Math.random() * unassignedPlayers.length);
      unassignedPlayers[idx].role = 'detective';
      unassignedPlayers.splice(idx, 1);
    }

    // Angel
    if (selectedRoles.angel && unassignedPlayers.length > 0) {
      const idx = Math.floor(Math.random() * unassignedPlayers.length);
      unassignedPlayers[idx].role = 'angel';
      unassignedPlayers.splice(idx, 1);
    }

    // Rambo
    if (selectedRoles.rambo && unassignedPlayers.length > 0) {
      const idx = Math.floor(Math.random() * unassignedPlayers.length);
      unassignedPlayers[idx].role = 'rambo';
      unassignedPlayers.splice(idx, 1);
    }

    // Bestfriends
    let bestfriendsActive = [];
    if (selectedRoles.bestfriends && unassignedPlayers.length >= 2) {
      const idx1 = Math.floor(Math.random() * unassignedPlayers.length);
      const friend1 = unassignedPlayers[idx1];
      friend1.role = 'bestfriends';
      unassignedPlayers.splice(idx1, 1);

      const idx2 = Math.floor(Math.random() * unassignedPlayers.length);
      const friend2 = unassignedPlayers[idx2];
      friend2.role = 'bestfriends';
      unassignedPlayers.splice(idx2, 1);

      bestfriendsActive = [friend1.id, friend2.id];
    }

    // Villagers
    if (selectedRoles.villagers) {
      unassignedPlayers.forEach(p => {
        p.role = 'villagers';
      });
    }

    setGameState(prev => ({
      ...prev,
      players,
      selectedRoles,
      phase: 'roleReveal',
      round: 1,
      bestfriendsActive,
      gameLog: [`Game started with ${players.length} players!`]
    }));
  }, []);

  const startGameFromRoleReveal = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'night'
    }));
  }, []);

  const backToSetup = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'setup',
      gameLog: []
    }));
  }, []);

  return (
    <div className="mafia-container">
      <header className="mafia-header">
        <h1>🎭 Mafia Game</h1>
        <p className="subtitle">Eliminate the Mafia to save the village!</p>
      </header>

      {gameState.phase === 'setup' && (
        <Setup onStartGame={startGame} />
      )}

      {gameState.phase === 'roleReveal' && (
        <RoleReveal
          players={gameState.players}
          onContinue={startGameFromRoleReveal}
        />
      )}

      {(gameState.phase === 'night' || gameState.phase === 'day' || gameState.phase === 'results') && (
        <GamePlay
          gameState={gameState}
          setGameState={setGameState}
          onBackToSetup={backToSetup}
        />
      )}
    </div>
  );
};

export default MafiaGame;
