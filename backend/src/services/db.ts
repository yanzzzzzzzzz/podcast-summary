import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../uploads/podcast.db');
const db = new sqlite3.Database(dbPath);

const init = () => {
  db.run(`CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    upload_date TEXT NOT NULL,
    file_name TEXT NOT NULL,
    duration REAL NOT NULL,
    summary TEXT
  )`);
};

export function insertUploadRecord(
  uploadDate: string,
  fileName: string,
  duration: number,
  summary: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO uploads (upload_date, file_name, duration, summary) VALUES (?, ?, ?, ?)',
      [uploadDate, fileName, duration, summary],
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

export interface UploadRecord {
  id: number;
  upload_date: string;
  file_name: string;
  duration: number;
  summary: string;
}

export function getAllUploads(): Promise<UploadRecord[]> {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM uploads ORDER BY upload_date DESC',
      (err: Error | null, rows: UploadRecord[]) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

init();

export default db;
