import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GeminiSummarizeTranscript } from '../services/gemini';
import { insertUploadRecord, getAllUploads, getUploadById } from '../services/db';
import ffmpeg from 'fluent-ffmpeg';
import { fetchPodcastInfoFromUrl } from '../services/applePodcastInfo';

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration || 0);
    });
  });
}

async function downloadAudioFile(audioUrl: string): Promise<string> {
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`downloadAudioFile error: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
  const fileName = `${uniqueSuffix}-podcast-audio.mp3`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, Buffer.from(buffer));
  return filePath;
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('audio'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fullPath = path.resolve(req.file.path);
  const fileName = req.file.originalname;
  const uploadDate = new Date().toISOString();

  try {
    const duration = await getAudioDuration(fullPath);
    const transcript = await GeminiSummarizeTranscript(fullPath);
    const recordId = await insertUploadRecord(
      uploadDate,
      fileName,
      duration,
      transcript,
      req.file.filename,
    );
    res.json({
      message: 'Transcription successful',
      id: recordId,
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

router.post('/by-url', async (req: any, res: any) => {
  const { audioUrl } = req.body;
  if (!audioUrl) {
    return res.status(400).json({ error: 'No audio URL provided' });
  }

  try {
    const podcastInfo = await fetchPodcastInfoFromUrl(audioUrl);

    const downloadedFilePath = await downloadAudioFile(podcastInfo.audioUrl);
    console.log('downloadedFilePath', downloadedFilePath);

    const fileName = path.basename(downloadedFilePath);
    const uploadDate = new Date().toISOString();

    const duration = await getAudioDuration(downloadedFilePath);
    console.log('duration', duration);

    const transcript = await GeminiSummarizeTranscript(downloadedFilePath);
    console.log('transcript', transcript);

    const recordId = await insertUploadRecord(
      uploadDate,
      podcastInfo.episodeName,
      duration,
      transcript,
      fileName,
    );

    res.json({
      message: 'Podcast transcription successful',
      id: recordId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process podcast' });
  }
});

router.get('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const record = await getUploadById(id);
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upload' });
  }
});

export default router;
