[200~#!/bin/bash
set -e

echo "Refactoring modules to use centralized dmModuleStore..."

mkdir -p src/pages

# 1. Refactor SceneManager.jsx
cat > src/pages/SceneManager.jsx << 'EOF'
import React, { useState } from 'react';
import useSceneStore from '../store/sceneStore';
import useDmModuleStore from '../store/dmModuleStore';

const SceneManager = () => {
  const { scenes, activeSceneId, setActiveScene, updateSceneDescription } = useSceneStore();
  const [selectedNpc, setSelectedNpc] = useState(null);

  const { campaignNotes, setCampaignNotes, sceneNotes, setSceneNotes } = useDmModuleStore();

  const activeScene = scenes.find((scene) => scene.id === activeSceneId);
  if (!activeScene) return <p>No active scene selected.</p>;

  const handleNpcClick = (npc) => setSelectedNpc(npc);

  const handleSceneNotesChange = (e) => {
    setSceneNotes(activeScene.id, e.target.value);
  };

  return (
    <div className="bg-parchment text-ink p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">🎭 Scene Manager</h1>

      <div className="flex gap-6">
        <aside className="w-1/4 bg-white/80 border border-ink rounded p-4 overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-semibold mb-2">Scenes</h2>
          <ul>
            {scenes.map((scene) => (
              <li
                key={scene.id}
                className={`p-2 cursor-pointer rounded ${
                  scene.id === activeSceneId ? 'bg-ink text-parchment font-bold' : ''
                }`}
                onClick={() => {
                  setActiveScene(scene.id);
                  setSelectedNpc(null);
                }}
              >
                {scene.title}
              </li>
            ))}
          </ul>

          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Campaign DM Notes</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[100px]"
              placeholder="Enter campaign-wide DM notes here..."
              value={campaignNotes}
              onChange={(e) => setCampaignNotes(e.target.value)}
            />
          </section>
        </aside>

        <section className="flex-1 bg-white/80 border border-ink rounded p-4 max-h-[80vh] overflow-auto flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">{activeScene.title}</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded resize-y"
            rows={6}
            value={activeScene.description}
            onChange={(e) => updateSceneDescription(activeScene.id, e.target.value)}
          />

          <h3 className="mt-4 font-semibold">NPCs</h3>
          <ul className="mb-4">
            {activeScene.npcs.map((npc) => (
              <li
                key={npc.name}
                className="cursor-pointer text-blue-700 underline hover:text-blue-900"
                onClick={() => handleNpcClick(npc)}
              >
                {npc.name}
              </li>
            ))}
          </ul>

          {selectedNpc && (
            <div className="p-4 border border-ink rounded bg-white/90 mb-4">
              <h4 className="font-semibold">{selectedNpc.name}</h4>
              <p>{selectedNpc.description || 'No description available.'}</p>
            </div>
          )}

          <section>
            <h3 className="font-semibold text-xl mb-2">Scene DM Notes</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[100px]"
              placeholder="Enter notes specific to this scene..."
              value={sceneNotes[activeScene.id] || ''}
              onChange={handleSceneNotesChange}
            />
          </section>
        </section>
      </div>
    </div>
  );
};

export default SceneManager;
EOF

# 2. Refactor CombatTracker.jsx
cat > src/pages/CombatTracker.jsx << 'EOF'
import React from 'react';
import useCombatStore from '../store/combatStore';
import useDmModuleStore from '../store/dmModuleStore';

const CONDITIONS = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated'];

const CombatTracker = () => {
  const { combatants, activeTurnId, setActiveTurn, updateHp, toggleCondition, nextTurn } = useCombatStore();
  const { combatNotes, setCombatNotes } = useDmModuleStore();

  const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
  const activeCombatId = 'default'; // Extend later for actual combat encounter IDs

  const handleCombatNotesChange = (e) => {
    setCombatNotes(activeCombatId, e.target.value);
  };

  return (
    <div className="bg-parchment text-ink p-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">⚔️ Combat Tracker</h1>

      <table className="w-full border border-ink rounded shadow-md bg-white/90">
        <thead>
          <tr className="bg-ink text-parchment">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-center">HP</th>
            <th className="p-2 text-center">Initiative</th>
            <th className="p-2 text-center">Conditions</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCombatants.map(({ id, name, hp, maxHp, initiative, conditions }) => {
            const isActive = id === activeTurnId;
            return (
              <tr
                key={id}
                className={`${isActive ? 'bg-soul text-white font-semibold' : ''} border-t border-ink`}
                onClick={() => setActiveTurn(id)}
                style={{ cursor: 'pointer' }}
              >
                <td className="p-2">{name}</td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    min={0}
                    max={maxHp}
                    value={hp}
                    onChange={(e) => updateHp(id, Number(e.target.value))}
                    className="w-16 text-center border border-gray-400 rounded"
                  />{' '}
                  / {maxHp}
                </td>
                <td className="p-2 text-center">{initiative}</td>
                <td className="p-2 text-center space-x-1">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCondition(id, cond);
                      }}
                      className={`text-xs px-1 rounded border ${
                        conditions.includes(cond)
                          ? 'bg-ink text-parchment border-ink'
                          : 'bg-white text-ink border-gray-400'
                      }`}
                      title={cond}
                      type="button"
                    >
                      {cond[0]}
                    </button>
                  ))}
                </td>
                <td className="p-2 text-center">{isActive ? '👑 Active' : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <section className="mt-6 p-4 border border-ink rounded bg-white/80">
        <h3 className="font-semibold text-xl mb-2">Combat Notes</h3>
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-y min-h-[100px]"
          placeholder="Enter notes for the active combat encounter here..."
          value={combatNotes[activeCombatId] || ''}
          onChange={handleCombatNotesChange}
        />
      </section>

      <button
        onClick={nextTurn}
        className="mt-4 px-4 py-2 bg-ink text-parchment rounded hover:bg-soul transition"
        type="button"
      >
        Next Turn
      </button>
    </div>
  );
};

export default CombatTracker;
EOF

# 3. Refactor CampaignDashboard.jsx
cat > src/pages/CampaignDashboard.jsx << 'EOF'
import React, { useState } from 'react';
import useDmModuleStore from '../store/dmModuleStore';

const partyCharacters = [
  { name: 'Ollie McKenzie', level: 5, class: 'Fighter', AC: 18, player: 'Chris' },
  { name: 'Elara Swift', level: 4, class: 'Rogue', AC: 15, player: 'Ana' },
  { name: 'Thoron Dusk', level: 6, class: 'Wizard', AC: 12, player: 'Liam' },
  { name: 'Mira Sunwhisper', level: 5, class: 'Cleric', AC: 16, player: 'Sophia' },
];

const npcList = [
  { name: 'Darrett Highwater', description: 'Kalaman officer and contact for the party.', activeChapter: true, activeScene: true },
  { name: 'Kalaman Officers', description: 'Local military personnel defending Kalaman.', activeChapter: true, activeScene: false },
  { name: 'Scout Captain', description: 'Leader of the Red Dragon scouts in the area.', activeChapter: false, activeScene: false },
  { name: 'Red Dragon Soldiers', description: 'Soldiers loyal to the Red Dragon Army.', activeChapter: false, activeScene: true },
];

const CampaignDashboard = () => {
  const chapterInfo = useDmModuleStore((state) => state.chapterInfo);
  const campaignNotes = useDmModuleStore((state) => state.campaignNotes);
  const setCampaignNotes = useDmModuleStore((state) => state.setCampaignNotes);

  const [showNpcDescriptions, setShowNpcDescriptions] = useState({});

  const toggleDescription = (name) => {
    setShowNpcDescriptions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="bg-parchment text-ink p-6 min-h-screen max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">REAPER Campaign Dashboard</h1>

      <div className="flex gap-6">
        {/* Party Characters */}
        <section className="flex-1 bg-white/80 border border-ink rounded p-4 overflow-auto max-h-[80vh]">
          <h2 className="text-3xl font-semibold mb-4">Party Characters</h2>
          <table className="w-full border-collapse border border-ink">
            <thead>
              <tr className="bg-ink text-parchment">
                <th className="border border-ink p-2 text-left">Name</th>
                <th className="border border-ink p-2 text-center">Level</th>
                <th className="border border-ink p-2 text-left">Class</th>
                <th className="border border-ink p-2 text-center">AC</th>
                <th className="border border-ink p-2 text-left">Player</th>
              </tr>
            </thead>
            <tbody>
              {partyCharacters.map(({ name, level, class: cls, AC, player }) => (
                <tr key={name} className="hover:bg-gray-100">
                  <td className="border border-ink p-2 font-semibold">{name}</td>
                  <td className="border border-ink p-2 text-center">{level}</td>
                  <td className="border border-ink p-2">{cls}</td>
                  <td className="border border-ink p-2 text-center">{AC}</td>
                  <td className="border border-ink p-2">{player}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* NPC Overview */}
        <section className="flex-1 bg-white/80 border border-ink rounded p-4 overflow-auto max-h-[80vh]">
          <h2 className="text-3xl font-semibold mb-4">NPC Overview</h2>
          <table className="w-full border-collapse border border-ink">
            <thead>
              <tr className="bg-ink text-parchment">
                <th className="border border-ink p-2 text-left">Name</th>
                <th className="border border-ink p-2 text-left">Description</th>
                <th className="border border-ink p-2 text-center">Active in Chapter</th>
                <th className="border border-ink p-2 text-center">Active in Scene</th>
              </tr>
            </thead>
            <tbody>
              {npcList.map(({ name, description, activeChapter, activeScene }) => (
                <tr
                  key={name}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleDescription(name)}
                >
                  <td className="border border-ink p-2 font-semibold">{name}</td>
                  <td className="border border-ink p-2">
                    {showNpcDescriptions[name] ? description : <i>Click to show description</i>}
                  </td>
                  <td className="border border-ink p-2 text-center">{activeChapter ? '✅' : '—'}</td>
                  <td className="border border-ink p-2 text-center">{activeScene ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 italic text-sm">Click an NPC row to toggle description visibility.</p>
        </section>

        {/* Chapter Info */}
        <aside className="w-1/3 bg-white/80 border border-ink rounded p-4 max-h-[80vh] overflow-auto">
          <h2 className="text-3xl font-semibold mb-4">Chapter Info</h2>
          <h3 className="font-bold text-xl mb-2">{chapterInfo.title}</h3>
          <p className="mb-4 whitespace-pre-line">{chapterInfo.summary}</p>
          <blockquote className="italic text-sm text-gray-700">“{chapterInfo.flavorText}”</blockquote>

          <section className="mt-6">
            <h3 className="text-2xl font-semibold mb-2">Campaign Notes</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[120px]"
              placeholder="Enter campaign-wide DM notes here..."
              value={campaignNotes}
              onChange={(e) => setCampaignNotes(e.target.value)}
            />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CampaignDashboard;
EOF

echo "Refactoring complete! Modules now unified on dmModuleStore."

