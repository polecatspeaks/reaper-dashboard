import React, { useState } from 'react';
import useSceneStore from '../store/sceneStore';
import useDmModuleStore from '../store/dmModuleStore';

const SceneManager = () => {
  const { scenes, activeSceneId, setActiveScene, updateSceneDescription } = useSceneStore();
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [pendingMapAssignment, setPendingMapAssignment] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    campaignNotes,
    setCampaignNotes,
    sceneNotes,
    setSceneNotes,
    sceneMapAssignments = {},
    setSceneMapAssignments,
    removeMapFromScene,
  } = useDmModuleStore();

  const activeScene = scenes.find((scene) => scene.id === activeSceneId);
  if (!activeScene) return <p>No active scene selected.</p>;

  const handleNpcClick = (npc) => setSelectedNpc(npc);

  const handleSceneNotesChange = (e) => {
    setSceneNotes(activeScene.id, e.target.value);
  };

  const assignMapClick = (mapUrl) => {
    setPendingMapAssignment(mapUrl);
    setShowConfirm(true);
  };

  const confirmAssignment = () => {
    if (pendingMapAssignment && activeSceneId) {
      setSceneMapAssignments({
        ...sceneMapAssignments,
        [activeSceneId]: pendingMapAssignment,
      });
    }
    setPendingMapAssignment(null);
    setShowConfirm(false);
  };

  const cancelAssignment = () => {
    setPendingMapAssignment(null);
    setShowConfirm(false);
  };

  const unassignMap = () => {
    if (activeSceneId) {
      removeMapFromScene(activeSceneId);
    }
  };

  const allExtractedMaps = Object.values(sceneMapAssignments).filter(Boolean);

  const assignedMapUrl = sceneMapAssignments[activeSceneId];

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

          <section className="mb-4">
            <h3 className="font-semibold text-xl mb-2">Scene DM Notes</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-y min-h-[100px]"
              placeholder="Enter notes specific to this scene..."
              value={sceneNotes[activeScene.id] || ''}
              onChange={handleSceneNotesChange}
            />
          </section>

          <section>
            <h3 className="font-semibold text-xl mb-2">Assigned Map</h3>
            {assignedMapUrl ? (
              <>
                <img
                  src={assignedMapUrl.startsWith('http') ? assignedMapUrl : `http://localhost:4000${assignedMapUrl}`}
                  alt="Assigned Scene Map"
                  className="max-w-full max-h-96 object-contain border border-ink rounded mb-2"
                />
                <button
                  onClick={unassignMap}
                  className="mb-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  type="button"
                >
                  Remove Map
                </button>
              </>
            ) : (
              <p>No map assigned to this scene yet.</p>
            )}

            <h4 className="font-semibold mb-2">Assign a Map to this Scene:</h4>
            <ul className="flex flex-wrap gap-4 max-h-48 overflow-auto">
              {allExtractedMaps.length > 0 ? (
                allExtractedMaps.map((mapUrl) => (
                  <li
                    key={mapUrl}
                    className="cursor-pointer border border-ink rounded p-1 hover:bg-soul"
                    onClick={() => assignMapClick(mapUrl)}
                  >
                    <img
                      src={mapUrl.startsWith('http') ? mapUrl : `http://localhost:4000${mapUrl}`}
                      alt="Map thumbnail"
                      className="w-24 h-24 object-contain"
                    />
                  </li>
                ))
              ) : (
                <p className="italic">No extracted maps available.</p>
              )}
            </ul>
          </section>
        </section>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full text-center">
            <p className="mb-4">Assign this map to the scene?</p>
            <img
              src={pendingMapAssignment.startsWith('http') ? pendingMapAssignment : `http://localhost:4000${pendingMapAssignment}`}
              alt="Pending map"
              className="max-w-full max-h-64 mx-auto mb-4"
            />
            <button
              onClick={confirmAssignment}
              className="mr-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              Confirm
            </button>
            <button
              onClick={cancelAssignment}
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneManager;
