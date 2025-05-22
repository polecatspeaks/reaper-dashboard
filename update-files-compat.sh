#!/bin/bash

set -e

echo "Updating REAPER project files with fixed CampaignDashboard.jsx..."

# Create directories if missing
mkdir -p src/store
mkdir -p src/pages

# campaignStore.js
cat > src/store/campaignStore.js << 'EOF'
import create from 'zustand';

const useCampaignStore = create((set) => ({
  activeChapter: 'Chapter 4: Shadow of War',
  location: 'Kalaman',
  partyLevel: 4,
  plotThreads: [
    { id: 1, text: 'Vogler evacuated', completed: true },
    { id: 2, text: 'Red Dragon Army scouts spotted', completed: false },
    { id: 3, text: 'Retake Wheelwatch Outpost', completed: false },
    { id: 4, text: 'Zanas Sarlamir encountered', completed: false },
  ],
  npcs: ['Darrett Highwater', 'Kalaman Officers', 'Refugee Leaders'],

  togglePlotThread: (id) =>
    set((state) => ({
      plotThreads: state.plotThreads.map((thread) =>
        thread.id === id ? { ...thread, completed: !thread.completed } : thread
      ),
    })),
}));

export default useCampaignStore;
EOF

# CampaignDashboard.jsx with fixed .join(', ')
cat > src/pages/CampaignDashboard.jsx << 'EOF'
import React from 'react';
import useCampaignStore from '../store/campaignStore';

const CampaignDashboard = () => {
  const { activeChapter, location, partyLevel, plotThreads, npcs, togglePlotThread } = useCampaignStore();

  return (
    <div className="bg-parchment text-ink p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight">REAPER: Campaign Dashboard</h1>
      <p className="mt-2 text-lg italic">Because death is only the beginning of your session prep.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow">
          <h2 className="text-2xl font-semibold">📜 Active Chapter</h2>
          <p className="mt-2">{activeChapter}</p>
          <p className="text-sm text-gray-700">Location: {location} | Party Level: {partyLevel}</p>
        </section>

        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow">
          <h2 className="text-2xl font-semibold">🧠 Plot Threads</h2>
          <ul className="mt-2 list-disc list-inside text-sm">
            {plotThreads.map(({ id, text, completed }) => (
              <li
                key={id}
                className={completed ? 'line-through text-gray-500 cursor-pointer' : 'cursor-pointer'}
                onClick={() => togglePlotThread(id)}
                title="Click to toggle completion"
              >
                {completed ? '☑️' : '⬜'} {text}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-4 bg-white/80 border border-ink rounded-lg shadow md:col-span-2">
          <h2 className="text-2xl font-semibold">🧙 NPCs in Play</h2>
          <p className="mt-2">{npcs.join(', ')}</p>
        </section>
      </div>
    </div>
  );
};

export default CampaignDashboard;
EOF

echo "Files updated successfully with fix."

