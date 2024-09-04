// Import the CSS file for styling the application
import "./App.css";

// Import React library for building components
import React from 'react';

//route is used to define and manage different paths (or urls) within the application,allowing users to navigate between various components or pages.
// Import routing components from react-router-dom
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//BrowserRouter (aliased as Router here) is used to wrap your application and enable routing.
//Route is used to define routes for different components.
//Routes is a container for all your Route components.


// Import custom components for different parts of the application
import Footer from "./components/Footer";
import Home from './components/Home';
import Game from './components/Game';
import Analysis from './components/Analysis';

// Define the main App component
function App() {
  return (
    // Wrap the application in Router to enable routing
    <Router>
      <div>
        {/* Container for the main content */}
        <div className="content">
          {/* Define routing for different paths */}
          <Routes>
            {/* Render Home component for the root path */}
            <Route path="/" element={<Home />} />
            {/* Render Game component for the /game path */}
            <Route path="/game" element={<Game />} />
            {/* Render Analysis component for the /analysis path */}
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </div>
        {/* Footer component displayed on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

// Export the App component for use in other parts of the application
export default App;
