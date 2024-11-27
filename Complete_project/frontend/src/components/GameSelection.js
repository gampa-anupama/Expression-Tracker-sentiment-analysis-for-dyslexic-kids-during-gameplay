import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/GameSelection.css';
import Navbar from './Logout_bar';

const GameSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {}; // Destructure `username` from state

  const handleLogout = () => {
    console.log(`${username} logged out.`);
    navigate('/'); // Redirect to the home or login page
  };

  const games = [
    {
      id: 1,
      title: 'CRACK-THE-QUIZ',
      description: 'Answer simple quiz questions',
      image: 'images_2/quiz_game.png',
      onClick: () => navigate('/game', { state: { username, gameName: 'CRACK-THE-QUIZ' } }),
    },
    {
      id: 2,
      title: 'FIND-MISSING-LETTERS',
      description: 'Drag the missing letter to the letter',
      image: 'images_2/missing_letter.png',
      onClick: () => navigate('/game_2', { state: { username, gameName: 'FIND-MISSING-LETTERS' } }),
    },
  ];

  return (
    <div>
      <div className="game-selection-container">
        {/* Top Navbar */}
        <Navbar username={username} handleLogout={handleLogout} role="child" />

        {/* Main Content */}
        <h2>Select a Game</h2>
        <div className="game-cards">
          {games.map((game) => (
            <div key={game.id} className="game-card" onClick={game.onClick}>
              <img src={game.image} alt={game.title} className="game-image" />
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
