import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

interface AudioSegment {
  filePath: string;
  duration: number;
}

export async function splitAudio(
  inputPath: string,
  maxSizeInMB: number = 24,
): Promise<AudioSegment[]> {
  const tempDir = path.join(path.dirname(inputPath), 'temp_segments');
  await mkdir(tempDir, { recursive: true });

  const fileInfo = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });

  const duration = fileInfo.format.duration || 0;
  const fileSize = (await stat(inputPath)).size;
  const bytesPerSecond = fileSize / duration;
  const maxBytes = maxSizeInMB * 1024 * 1024;
  const segmentDuration = Math.floor((maxBytes / bytesPerSecond) * 0.95);

  const segments: AudioSegment[] = [];
  let startTime = 0;

  while (startTime < duration) {
    const segmentPath = path.join(tempDir, `segment_${segments.length}.mp3`);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(segmentDuration)
        .output(segmentPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    segments.push({
      filePath: segmentPath,
      duration: Math.min(segmentDuration, duration - startTime),
    });

    startTime += segmentDuration;
  }

  return segments;
}

export async function cleanupSegments(segments: AudioSegment[]): Promise<void> {
  for (const segment of segments) {
    try {
      await fs.promises.unlink(segment.filePath);
    } catch (error) {
      console.error(`Failed to delete segment: ${segment.filePath}`, error);
    }
  }

  // 尝试删除临时目录
  try {
    const tempDir = path.dirname(segments[0].filePath);
    await fs.promises.rmdir(tempDir);
  } catch (error) {
    console.error('Failed to delete temporary directory', error);
  }
}
