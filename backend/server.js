const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

/**
 * Extract pages containing "MAP" (case-insensitive) from PDF text
 * Returns array of page numbers
 */
function getMapPages(pdfPath) {
  return new Promise((resolve, reject) => {
    // Extract all pages text to temp file
    const txtFile = pdfPath + '.txt';

    exec(`pdftotext "${pdfPath}" "${txtFile}"`, (err) => {
      if (err) return reject(err);

      fs.readFile(txtFile, 'utf8', (err, data) => {
        if (err) {
          fs.unlink(txtFile, () => {});
          return reject(err);
        }

        // Split text by form feed (page break \f)
        const pages = data.split('\f');
        const mapPages = [];
        pages.forEach((pageText, idx) => {
          if (pageText.toLowerCase().includes('map')) {
            // Pages are 1-indexed in pdfimages
            mapPages.push(idx + 1);
          }
        });

        fs.unlink(txtFile, () => {});
        resolve(mapPages);
      });
    });
  });
}

app.post('/extract-maps', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  const inputPath = req.file.path;
  const baseName = path.parse(req.file.originalname).name;
  const outputDir = path.join(__dirname, 'public', 'maps', baseName);

  fs.mkdirSync(outputDir, { recursive: true });

  try {
    const mapPages = await getMapPages(inputPath);
    if (mapPages.length === 0) {
      // No map pages found, fallback to extracting all images
      const cmdAll = `pdfimages -png "${inputPath}" "${path.join(outputDir, 'map')}"`;
      await new Promise((resolve, reject) => {
        exec(cmdAll, (error) => (error ? reject(error) : resolve()));
      });
    } else {
      // Extract images only from pages containing "MAP"
      for (const pageNum of mapPages) {
        const cmdPage = `pdfimages -png -f ${pageNum} -l ${pageNum} "${inputPath}" "${path.join(outputDir, 'map_' + pageNum + '_')}"`;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve, reject) => {
          exec(cmdPage, (error) => (error ? reject(error) : resolve()));
        });
      }
    }

    const files = fs.readdirSync(outputDir)
      .filter(f => f.endsWith('.png'))
      .map(f => `/maps/${baseName}/${f}`);

    fs.unlinkSync(inputPath);

    res.json({ maps: files });
  } catch (error) {
    console.error('Error extracting images:', error);
    fs.unlinkSync(inputPath);
    res.status(500).send('Error extracting images');
  }
});

app.use('/maps', express.static(path.join(__dirname, 'public', 'maps')));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Map extraction backend running on port ${port}`));
