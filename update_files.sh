#!/bin/bash
set -e

echo "Fixing DmModule.jsx: restore PDF upload UI with map assignments overview and export..."

mkdir -p src/pages

cat > src/pages/DmModule.jsx << 'EOF'
import React, { useState } from 'react';
import useDmModuleStore from '../store/dmModuleStore';
import useSceneStore from '../store/sceneStore';
import useCombatStore from '../store/combatStore';

const DmModule = () => {
  const {
    campaignNotes,
    sceneNotes,
    combatNotes,
    chapterInfo,
    sceneMapAssignments = {},
    setCampaignNotes,
    setSceneNotes,
    setCombatNotes,
    setSceneMapAssignments,
  } = useDmModuleStore();

  const { scenes } = useSceneStore();
  const { combatants } = useCombatStore();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedMaps, setExtractedMaps] = useState([]);
  const [exportJson, setExportJson] = useState('');

  // Upload PDF and extract maps
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadPdf = async () => {
    if (!selectedFile) return alert('Please select a PDF file first.');

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:4000/extract-maps', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setExtractedMaps(data.maps);
      // Add new extracted maps to assignments (optional, or manage separately)
      // For now just show them here; assign in SceneManager
    } catch (error) {
      alert('Error uploading or extracting maps: ' + error.message);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleExport = () => {
    const exportData = {
      sceneMapAssignments,
      campaignNotes,
      sceneNotes,
      combatNotes,
      chapterInfo,
    };
    setExportJson(JSON.stringify(exportData, null, 2));
  };

  const handleClearExport = () => {
    setExportJson('');
  };

  return (
    <div className="bg-parchment text-ink p-6 min-h-screen max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🛡️ DM Module Dashboard</h1>

      {/* Chapter Info */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Chapter Info</h2>
        <h3 className="font-bold text-xl mb-2">{chapterInfo.title}</h3>
        <p className="mb-4 whitespace-pre-line">{chapterInfo.summary}</p>
        <blockquote className="italic text-sm text-gray-700">“{chapterInfo.flavorText}”</blockquote>
      </section>

      {/* Campaign Notes */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Campaign Notes</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-y min-h-[120px]"
          placeholder="Enter campaign-wide DM notes here..."
          value={campaignNotes}
          onChange={(e) => setCampaignNotes(e.target.value)}
        />
      </section>

      {/* Scene Notes */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Scene Notes</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-y min-h-[120px]"
          placeholder="Enter notes for the active scene here..."
          value={sceneNotes}
          onChange={(e) => setSceneNotes(e.target.value)}
        />
      </section>

      {/* Combat Notes */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Combat Notes</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded resize-y min-h-[120px]"
          placeholder="Enter notes for the active combat encounter here..."
          value={combatNotes}
          onChange={(e) => setCombatNotes(e.target.value)}
        />
      </section>

      {/* PDF Upload and map extraction */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Upload Chapter PDF to Extract Maps</h2>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button
          onClick={uploadPdf}
          disabled={uploading || !selectedFile}
          className="mt-2 px-4 py-2 bg-ink text-parchment rounded hover:bg-soul transition"
        >
          {uploading ? 'Uploading...' : 'Upload & Extract Maps'}
        </button>

        {extractedMaps.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold">Extracted Maps (Assign in Scene Manager)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 max-h-96 overflow-auto">
              {extractedMaps.map((url) => (
                <div key={url} className="border border-ink rounded p-2">
                  <img
                    src={`http://localhost:4000${url}`}
                    alt="Extracted Map"
                    className="max-w-full max-h-48 object-contain"
                  />
                  <p className="text-center mt-1 text-sm truncate">{url.split('/').pop()}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Map Assignments List */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Map Assignments</h2>
        {Object.keys(sceneMapAssignments).length > 0 ? (
          <ul>
            {Object.entries(sceneMapAssignments).map(([sceneId, mapUrl]) => (
              <li key={sceneId} className="mb-2">
                <strong>Scene ID:</strong> {sceneId} <br />
                <img
                  src={mapUrl.startsWith('http') ? mapUrl : `http://localhost:4000${mapUrl}`}
                  alt={`Map for scene ${sceneId}`}
                  className="max-w-xs max-h-48 object-contain border border-ink rounded mt-1"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No map assignments yet.</p>
        )}
      </section>

      {/* Export JSON */}
      <section className="mb-8 bg-white/80 border border-ink rounded p-4">
        <h2 className="text-3xl font-semibold mb-3">Export DM Data as JSON</h2>
        <button
          onClick={() => {
            const exportData = {
              sceneMapAssignments,
              campaignNotes,
              sceneNotes,
              combatNotes,
              chapterInfo,
            };
            alert('Copy the JSON from the box below to save your data.');
            setExportJson(JSON.stringify(exportData, null, 2));
          }}
          className="mb-4 px-4 py-2 bg-ink text-parchment rounded hover:bg-soul transition"
        >
          Generate JSON Export
        </button>
        {exportJson && (
          <>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 whitespace-pre-wrap">{exportJson}</pre>
            <button
              onClick={() => setExportJson('')}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Export
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default DmModule;
EOF

echo "Restored PDF upload UI in DmModule.jsx with map assignment overview and JSON export."

