import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(filePath: string): Promise<string> {
  const file = fs.createReadStream(path.resolve(filePath));
  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'text',
    language: 'zh',
  });
  return response;
}
