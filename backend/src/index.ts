import express from 'express';
import summarizeTranscriptRouter from './routes/summarizeTranscriptRoutes';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/summarize-transcript', summarizeTranscriptRouter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
