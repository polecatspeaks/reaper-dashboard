import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CampaignDashboard from './pages/CampaignDashboard';
import SceneManager from './pages/SceneManager';
import CombatTracker from './pages/CombatTracker';

function App() {
  return (
    <Router>
      <div className="bg-parchment min-h-screen text-ink">
        <nav className="bg-ink text-parchment p-4">
          <ul className="flex gap-6">
            <li><Link to="/" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/scene" className="hover:underline">Scene Manager</Link></li>
            <li><Link to="/combat" className="hover:underline">Combat Tracker</Link></li>
          </ul>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<CampaignDashboard />} />
            <Route path="/scene" element={<SceneManager />} />
            <Route path="/combat" element={<CombatTracker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
