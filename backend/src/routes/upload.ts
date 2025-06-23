import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GeminiSummarizeTranscript } from '../services/gemini';
const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/summarize-transcript', upload.single('audio'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fullPath = path.resolve(req.file.path);

  try {
    const transcript = await GeminiSummarizeTranscript(fullPath);
    res.json({
      message: 'Transcription successful',
      transcript,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

export default router;
