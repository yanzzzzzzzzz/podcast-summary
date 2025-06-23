import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import { splitAudio, cleanupSegments } from './audioSplitter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function transcribeAudio(filePath: string): Promise<string> {
  try {
    const segments = await splitAudio(filePath);
    const transcriptions: string[] = [];

    for (const segment of segments) {
      const segmentFile = fs.createReadStream(segment.filePath);
      const response = await openai.audio.transcriptions.create({
        file: segmentFile,
        model: 'whisper-1',
        response_format: 'text',
        language: 'zh',
      });
      transcriptions.push(response);
    }

    await cleanupSegments(segments);

    return transcriptions.join(' ');
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}
