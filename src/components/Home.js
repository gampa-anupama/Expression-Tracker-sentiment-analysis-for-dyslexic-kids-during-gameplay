import React from 'react';
import './Home.css'; // Assuming your styles are in Home.css

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <nav className="nav-links">
          
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/learn-more">Learn More</a>
        </nav>
      </header>
      <main className="main-content">
        <div className="home-buttons">
          <button onClick={() => window.location.href = '/game'}>Play the Game</button>
          <button onClick={() => window.location.href = '/analysis'}>Get Analysis</button>
        </div>
      </main>
      <footer className="footer">Footer Content</footer>
    </div>
  );
};

export default Home;
