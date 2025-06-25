import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';

export async function GeminiSummarizeTranscript(filePath: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const base64AudioFile = fs.readFileSync(filePath, {
    encoding: 'base64',
  });

  const contents = [
    {
      text: 'Given the following timestamped transcript, ignore all advertisement or sponsor segments (detectable by keywords such as sponsor, ad) and any promotional content; then create a hierarchical summary **in Traditional Chinese only** that (1) groups the talk into coherent sections, (2) starts each section with a concise title prefixed by an ordered number and its overall timestamp range, and (3) lists 2-5 indented bullet points under each title, each bullet ending with its own timestamp or short range; keep points chronologically ordered, be concise (do not replicate the transcript verbatim), and output nothing except the formatted summary.  Output example: 1. Title1 [00:00-02:10]\n • point1 [00:10]\n • point2 [01:45-02:05]\n2. Next title…```',
    },
    {
      inlineData: {
        mimeType: 'audio/mp3',
        data: base64AudioFile,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
  });
  if (response.text != null) {
    return response.text;
  }
  return '';
}
