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
