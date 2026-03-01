require('dotenv').config();
const express = require('express');
const multer  = require('multer');
const fetch   = require('node-fetch');
const pdfParse = require('pdf-parse');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app    = express();
app.use(express.static('public'));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ── PDF extraction endpoint ──
app.post('/api/extract-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });
    const data = await pdfParse(req.file.buffer);
    const text = data.text.trim();
    if (!text || text.length < 30) {
      return res.status(422).json({ error: 'Could not extract readable text from this PDF. It may be a scanned image — try the Photo option instead.' });
    }
    res.json({ text, pages: data.numpages, chars: text.length });
  } catch (err) {
    console.error('PDF error:', err.message);
    res.status(500).json({ error: 'PDF extraction failed: ' + err.message });
  }
});

// ── Claude API proxy ──
app.post('/api/generate', async (req, res) => {
  try {
    const { messages, max_tokens } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured on server' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 3000,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Claude API error' });
    }
    res.json(data);
  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Serve frontend for all other routes ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`StudyFree running on port ${PORT}`));
