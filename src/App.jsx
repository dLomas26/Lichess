import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import Tournaments from './components/Tournaments';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tournaments" element={<Tournaments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;