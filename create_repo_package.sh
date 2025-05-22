#!/bin/bash

set -e

BASE_DIR="repo_package"

echo "Creating repo_package folder with fresh REAPER source files..."

mkdir -p $BASE_DIR/public
mkdir -p $BASE_DIR/src/pages
mkdir -p $BASE_DIR/src

cat > $BASE_DIR/package.json << 'EOF'
{
  "name": "reaper-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "zustand": "^4.3.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.2",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.21"
  }
}
EOF

cat > $BASE_DIR/tailwind.config.js << 'EOF'
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: '#f3f0e7',
        ink: '#1a1a1a',
        soul: '#2e3142',
      },
    },
  },
  plugins: [],
}
EOF

cat > $BASE_DIR/postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

cat > $BASE_DIR/.gitignore << 'EOF'
node_modules/
build/
.env
.DS_Store
EOF

cat > $BASE_DIR/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>REAPER Dashboard</title>
  </head>
  <body class="bg-parchment text-ink">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

cat > $BASE_DIR/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > $BASE_DIR/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat > $BASE_DIR/src/App.jsx << 'EOF'
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
EOF

cat > $BASE_DIR/src/pages/CampaignDashboard.jsx << 'EOF'
import React from 'react';

const CampaignDashboard = () => {
  return (
    <div className="bg-parchment text-ink p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight">REAPER: Campaign Dashboard</h1>
      <p className="mt-2 text-lg italic">Because death is only the beginning of your session prep.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow">
          <h2 className="text-2xl font-semibold">📜 Active Chapter</h2>
          <p className="mt-2">Chapter 4: Shadow of War</p>
          <p className="text-sm text-gray-700">Location: Kalaman | Party Level: 4</p>
        </section>

        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow">
          <h2 className="text-2xl font-semibold">🧠 Plot Threads</h2>
          <ul className="mt-2 list-disc list-inside text-sm">
            <li>☑️ Vogler evacuated</li>
            <li>⬜ Red Dragon Army scouts spotted</li>
            <li>⬜ Retake Wheelwatch Outpost</li>
            <li>⬜ Zanas Sarlamir encountered</li>
          </ul>
        </section>

        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow md:col-span-2">
          <h2 className="text-2xl font-semibold">🧙 NPCs in Play</h2>
          <p className="mt-2">Darrett Highwater, Kalaman Officers, Refugee Leaders</p>
        </section>
      </div>
    </div>
  );
};

export default CampaignDashboard;
EOF

cat > $BASE_DIR/src/pages/SceneManager.jsx << 'EOF'
import React from 'react';

const SceneManager = () => {
  return (
    <div className="bg-parchment text-ink p-6 min-h-screen">
      <h1 className="text-4xl font-bold">🎭 Scene Manager</h1>
      <p className="mt-2 text-lg italic">Direct the drama. Or rewrite the whole script when they burn the town down.</p>

      <div className="mt-6">
        <p className="text-sm text-gray-700">Scene list coming soon...</p>
      </div>
    </div>
  );
};

export default SceneManager;
EOF

cat > $BASE_DIR/src/pages/CombatTracker.jsx << 'EOF'
import React from 'react';

const CombatTracker = () => {
  return (
    <div className="bg-parchment text-ink p-6 min-h-screen">
      <h1 className="text-4xl font-bold">⚔️ Combat Tracker</h1>
      <p className="mt-2 text-lg italic">Keep it fair, keep it brutal. Or just fudge the dice like a god.</p>

      <div className="mt-6">
        <p className="text-sm text-gray-700">Combat tracker UI coming soon...</p>
      </div>
    </div>
  );
};

export default CombatTracker;
EOF

echo "All files created successfully in $BASE_DIR."

