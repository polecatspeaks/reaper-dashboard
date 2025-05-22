const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // timestamp + original extension for uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Serve static maps images from /public/maps
app.use('/maps', express.static(path.join(__dirname, 'public', 'maps')));

const DATA_DIR = path.join(__dirname, 'data');
const SCENES_FILE = path.join(DATA_DIR, 'scenes.json');
const MAPS_FILE = path.join(DATA_DIR, 'maps.json');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// POST upload PDF and extract maps
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // TODO: Add pdfimages extraction logic here
  // For now, just send success response

  console.log('Received file:', req.file.filename);
  res.json({ success: true, filename: req.file.filename });
});

// GET all maps
app.get('/api/maps', (req, res) => {
  const maps = readJson(MAPS_FILE);
  res.json(maps);
});

// GET all scenes
app.get('/api/scenes', (req, res) => {
  const scenes = readJson(SCENES_FILE);
  res.json(scenes);
});

// POST assign maps to a scene (replace assignedMaps)
app.post('/api/scenes/:sceneId/maps', (req, res) => {
  const { sceneId } = req.params;
  const { mapIds } = req.body;

  if (!Array.isArray(mapIds)) {
    return res.status(400).json({ error: 'mapIds must be an array' });
  }

  const scenes = readJson(SCENES_FILE);
  const maps = readJson(MAPS_FILE);

  const scene = scenes.find((s) => s.id === sceneId);
  if (!scene) return res.status(404).json({ error: 'Scene not found' });

  const validMaps = mapIds.filter((id) => maps.some((m) => m.id === id));

  scene.assignedMaps = validMaps.map((id) => maps.find((m) => m.id === id));

  writeJson(SCENES_FILE, scenes);

  res.json(scene);
});

// DELETE a map assignment from a scene
app.delete('/api/scenes/:sceneId/maps/:mapId', (req, res) => {
  const { sceneId, mapId } = req.params;

  const scenes = readJson(SCENES_FILE);
  const scene = scenes.find((s) => s.id === sceneId);

  if (!scene) return res.status(404).json({ error: 'Scene not found' });

  scene.assignedMaps = (scene.assignedMaps || []).filter((m) => m.id !== mapId);

  writeJson(SCENES_FILE, scenes);

  res.json(scene);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`REAPER backend running on port ${PORT}`);
});
