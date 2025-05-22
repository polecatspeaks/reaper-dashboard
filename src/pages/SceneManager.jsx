import React, { useState, useEffect } from 'react';

export default function SceneManager() {
  const [scenes, setScenes] = useState([]);
  const [maps, setMaps] = useState([]);
  const [assignments, setAssignments] = useState({}); // sceneId => [mapIds]
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetch('/api/scenes')
      .then(res => res.json())
      .then(data => {
        setScenes(data);
        const init = {};
        data.forEach(scene => {
          init[scene.id] = (scene.assignedMaps || []).map(m => m.id);
        });
        setAssignments(init);
      });
    fetch('/api/maps')
      .then(res => res.json())
      .then(setMaps);
  }, []);

  function onMapSelect(sceneId, selectedOptions) {
    const selectedIds = Array.from(selectedOptions).map(o => o.value);
    setAssignments(prev => ({ ...prev, [sceneId]: selectedIds }));
  }

  async function saveAssignments(sceneId) {
    setUploading(true);
    try {
      const res = await fetch(`/api/scenes/${sceneId}/maps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapIds: assignments[sceneId] || [] }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const updatedScene = await res.json();
      setScenes(prev =>
        prev.map(s => (s.id === sceneId ? updatedScene : s))
      );
      alert('Maps saved!');
    } catch (e) {
      alert('Error saving maps: ' + e.message);
    } finally {
      setUploading(false);
    }
  }

  async function onDrop(event) {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (!files.length) return;
    await uploadPdf(files[0]);
  }

  async function uploadPdf(file) {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      alert('PDF uploaded and maps extracted!');
      const mapsRes = await fetch('/api/maps');
      const newMaps = await mapsRes.json();
      setMaps(newMaps);
      const scenesRes = await fetch('/api/scenes');
      const newScenes = await scenesRes.json();
      setScenes(newScenes);
    } catch (e) {
      alert('Error uploading PDF: ' + e.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={onDrop}
      style={{
        padding: 20,
        backgroundColor: dragOver ? '#f0f8ff' : 'transparent',
        border: dragOver ? '2px dashed #0a74da' : '2px dashed transparent',
        marginBottom: 20,
      }}
    >
      <p>Drag & drop a chapter PDF here or use the file input below to upload and extract maps:</p>
      <input
        type="file"
        accept=".pdf"
        disabled={uploading}
        onChange={e => e.target.files.length && uploadPdf(e.target.files[0])}
      />
      {uploading && <p>Uploading and extracting maps...</p>}

      <h2>Scenes</h2>

      {scenes.map(scene => (
        <div
          key={scene.id}
          style={{
            marginBottom: 30,
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 6,
          }}
        >
          <h3>{scene.name}</h3>
          <label>
            Assign Maps (hold Ctrl/Cmd to multi-select):
            <br />
            <select
              multiple
              size={Math.min(5, maps.length)}
              style={{ width: '100%', marginTop: 8 }}
              value={assignments[scene.id] || []}
              onChange={e => onMapSelect(scene.id, e.target.selectedOptions)}
            >
              {maps.map(map => (
                <option key={map.id} value={map.id}>
                  {map.filename || map.id}
                </option>
              ))}
            </select>
          </label>

          <div
            style={{
              marginTop: 10,
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            {(assignments[scene.id] || []).map(mapId => {
              const map = maps.find(m => m.id === mapId);
              if (!map) return null;
              return (
                <img
                  key={mapId}
                  src={`/maps/${map.filename || map.id}`}
                  alt={map.filename || 'map'}
                  style={{ maxHeight: 100, border: '1px solid #aaa', borderRadius: 4 }}
                />
              );
            })}
          </div>

          <button
            onClick={() => saveAssignments(scene.id)}
            disabled={uploading}
            style={{
              marginTop: 10,
              padding: '8px 16px',
              backgroundColor: '#0a74da',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Save Maps
          </button>
        </div>
      ))}
    </div>
  );
}

