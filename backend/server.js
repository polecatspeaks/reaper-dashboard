const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static maps images from /public/maps
app.use('/maps', express.static(path.join(__dirname, 'public', 'maps')));

const DATA_DIR = path.join(__dirname, 'data');
const SCENES_FILE = path.join(DATA_DIR, 'scenes.json');
const MAPS_FILE = path.join(DATA_DIR, 'maps.json');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MAPS_DIR = path.join(__dirname, 'public', 'maps');

// Setup multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Upload PDF and extract maps
app.post('/api/upload-pdf', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }
  const pdfPath = req.file.path;
  const outputPrefix = path.join(MAPS_DIR, `map-${Date.now()}`);

  if (!fs.existsSync(MAPS_DIR)) {
    fs.mkdirSync(MAPS_DIR, { recursive: true });
  }

  const cmd = `pdfimages -png "${pdfPath}" "${outputPrefix}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Error extracting images:', error);
      return res.status(500).json({ error: 'Image extraction failed' });
    }

    const extractedFiles = fs.readdirSync(MAPS_DIR)
      .filter(f => f.startsWith(path.basename(outputPrefix)))
      .map((filename, index) => ({
        id: `map-${Date.now()}-${index}`,
        filename,
        url: `/maps/${filename}`
      }));

    let maps = [];
    if (fs.existsSync(MAPS_FILE)) {
      maps = JSON.parse(fs.readFileSync(MAPS_FILE));
    }
    maps = maps.concat(extractedFiles);

    fs.writeFileSync(MAPS_FILE, JSON.stringify(maps, null, 2));

    res.json({ extractedMaps: extractedFiles });
  });
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
