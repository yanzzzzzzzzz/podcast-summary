import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GeminiSummarizeTranscript } from '../services/gemini';
import { insertUploadRecord, getAllUploads } from '../services/db';
import ffmpeg from 'fluent-ffmpeg';
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
  const fileName = req.file.originalname;
  const uploadDate = new Date().toISOString();

  function getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });
  }

  try {
    const duration = await getAudioDuration(fullPath);
    const transcript = await GeminiSummarizeTranscript(fullPath);
    await insertUploadRecord(uploadDate, fileName, duration, transcript);
    res.json({
      message: 'Transcription successful',
      transcript,
      uploadDate,
      fileName,
      duration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

router.get('/summarize-transcript/list', async (req, res) => {
  try {
    const list = await getAllUploads();
    res.json({ list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
});

export default router;
