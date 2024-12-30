import React from 'react';
import LoginPage from './components/Login/Login';
import Register from './components/Login/Register';
import Game from './components/Game/Game';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
