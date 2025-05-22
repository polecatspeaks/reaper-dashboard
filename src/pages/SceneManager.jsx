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
