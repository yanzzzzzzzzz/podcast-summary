import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../uploads/podcast.db');
const db = new sqlite3.Database(dbPath);

const init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uploadDate TEXT NOT NULL,
    fileName TEXT NOT NULL,
    duration REAL NOT NULL,
    summary TEXT,
    saveFileName TEXT NOT NULL
  )`);
};

export function insertUploadRecord(
  uploadDate: string,
  fileName: string,
  duration: number,
  summary: string,
  saveFileName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO uploads (uploadDate, fileName, duration, summary, saveFileName) VALUES (?, ?, ?, ?, ?)',
      [uploadDate, fileName, duration, summary, saveFileName],
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

export interface UploadRecord {
  id: number;
  uploadDate: string;
  fileName: string;
  duration: number;
  summary: string;
  saveFileName: string;
}

export function getAllUploads(): Promise<UploadRecord[]> {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM uploads ORDER BY uploadDate DESC',
      (err: Error | null, rows: UploadRecord[]) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

export function getUploadById(id: number): Promise<UploadRecord | null> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM uploads WHERE id = ?', [id], (err: Error | null, row: UploadRecord) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

init();

export default db;
