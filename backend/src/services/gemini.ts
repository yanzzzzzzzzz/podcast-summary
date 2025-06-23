import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';

export async function GeminiSummarizeTranscript(filePath: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const base64AudioFile = fs.readFileSync(filePath, {
    encoding: 'base64',
  });

  const contents = [
    {
      text: 'Given the transcript below, which contains line-by-line speech with timestamps, create a structured summary by extracting key points in the order they appear, each point should be concise, postfixed with its timestamp, and formatted as a numbered bullet list.Output Format Example:Introduction of the host and sponsor[00:00-00:04]\\n Explanation of VPN threat protection features.[00:12-00:22].Output with traditional chinese only',
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
