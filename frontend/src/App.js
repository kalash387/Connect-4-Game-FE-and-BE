import React from 'react';
import LoginPage from './components/Login/Login';
import Register from './components/Login/Register';
import Game from './components/Game/Game';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Import the CSS file for styling
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="centered-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/game"
            element={
              <Game />
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
