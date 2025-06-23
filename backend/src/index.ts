import express from 'express';
import uploadRouter from './routes/upload';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', uploadRouter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
