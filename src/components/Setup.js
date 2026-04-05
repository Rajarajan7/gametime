import React, { useState, useEffect } from 'react';

const Setup = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState(Array(5).fill(''));
  const [mafiaCount, setMafiaCount] = useState(Math.max(1, Math.floor(5 / 4)));
  const [selectedRoles, setSelectedRoles] = useState({
    godfather: false,
    mafia: true,
    detective: true,
    angel: true,
    bestfriends: false,
    rambo: false,
    villagers: true
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setPlayerNames(Array(playerCount).fill(''));
  }, [playerCount]);

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value) || '';
    if (count === '') {
      setPlayerCount('');
    } else if (count > 0) {
      setPlayerCount(count);
    }
  };

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleRoleChange = (role) => {
    // Prevent unchecking mandatory roles
    if (['mafia', 'detective', 'angel'].includes(role)) {
      return;
    }
    setSelectedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const validateInputs = () => {
    const newErrors = [];
    const filledNames = playerNames.filter(n => n.trim());

    if (playerCount < 5) {
      newErrors.push('Minimum 5 players required');
    }

    if (filledNames.length !== playerCount) {
      newErrors.push(`You entered ${filledNames.length} names but specified ${playerCount} players`);
    }

    if (new Set(filledNames).size !== filledNames.length) {
      newErrors.push('All player names must be unique');
    }

    // Mandatory roles validation
    if (!selectedRoles.mafia) {
      newErrors.push('Mafia is mandatory');
    }

    if (!selectedRoles.detective) {
      newErrors.push('Detective is mandatory (investigates Mafia)');
    }

    if (!selectedRoles.angel) {
      newErrors.push('Angel is mandatory (saves from Mafia kills)');
    }

    // Validate Mafia count
    if (mafiaCount < 1) {
      newErrors.push('At least 1 Mafia member is required');
    }

    if (mafiaCount > playerCount - 4) {
      newErrors.push(`Too many Mafias! Maximum should be ${Math.max(1, playerCount - 4)} (leaving room for Detective, Angel, and Villagers)`);
    }

    let requiredRoles = 0;
    if (selectedRoles.godfather) requiredRoles += 1;
    if (selectedRoles.mafia) requiredRoles += mafiaCount;
    if (selectedRoles.detective) requiredRoles += 1;
    if (selectedRoles.angel) requiredRoles += 1;
    if (selectedRoles.bestfriends) requiredRoles += 2;
    if (selectedRoles.rambo) requiredRoles += 1;

    if (requiredRoles > playerCount) {
      newErrors.push('Total required roles exceed number of players. Try fewer optional roles or more players.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleStartGame = () => {
    if (validateInputs()) {
      onStartGame(playerNames.filter(n => n.trim()), selectedRoles, mafiaCount);
    }
  };

  const roles = [
    { key: 'godfather', label: '👑 Godfather (can block)', desc: 'Commands the Mafia', mandatory: false },
    { key: 'mafia', label: '🔫 Mafia', desc: 'Kills at night', mandatory: true },
    { key: 'detective', label: '🔍 Detective', desc: 'Investigates Mafia', mandatory: true },
    { key: 'angel', label: '😇 Angel', desc: 'Saves from Mafia kills', mandatory: true },
    { key: 'bestfriends', label: '👯 Bestfriends', desc: 'Pair dies together', mandatory: false },
    { key: 'rambo', label: '💪 Rambo', desc: 'Kills once per game', mandatory: false },
    { key: 'villagers', label: '🌾 Villagers', desc: 'Fill remaining slots', mandatory: true }
  ];

  return (
    <div className="setup-section">
      <h2>Game Setup</h2>

      <div className="form-group">
        <label htmlFor="playerCount">Number of Players:</label>
        <input
          id="playerCount"
          type="text"
          value={playerCount}
          onChange={handlePlayerCountChange}
          placeholder="Enter number of players"
        />
      </div>

      <div className="form-group">
        <label>Player Names:</label>
        <div className="names-grid">
          {playerNames.map((name, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="name-input"
            />
          ))}
        </div>
      </div>

      <div className="form-group role-selection">
        <label>Select Roles to Include:</label>
        <p style={{ fontSize: '0.9rem', marginBottom: '10px', color: '#e74c3c' }}>
          ⚠️ Mandatory roles: � Mafia, 🔍 Detective, 😇 Angel, 🌾 Villagers
        </p>

        <div className="form-group">
          <label htmlFor="mafiaCount">Number of Mafia Members:</label>
          <input
            id="mafiaCount"
            type="number"
            min="1"
            max={Math.max(1, playerCount - 4)}
            value={mafiaCount}
            onChange={(e) => setMafiaCount(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ marginBottom: '15px' }}
          />
          <small style={{ color: '#7f8c8d', display: 'block', marginTop: '-10px', marginBottom: '15px' }}>
            Max: {Math.max(1, playerCount - 4)} members (room for Detective, Angel, and Villagers)
          </small>
        </div>
        <div className="checkbox-grid">
          {roles.map(role => (
            <div key={role.key} className="checkbox-item" style={role.mandatory ? { opacity: 0.7, cursor: 'not-allowed' } : {}}>
              <input
                type="checkbox"
                id={`role-${role.key}`}
                checked={selectedRoles[role.key]}
                onChange={() => handleRoleChange(role.key)}
                disabled={role.mandatory}
              />
              <label htmlFor={`role-${role.key}`}>
                <span className="role-name">{role.label}{role.mandatory ? ' 🔒' : ''}</span>
                <span className="role-desc">{role.desc}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-container">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default Setup;
