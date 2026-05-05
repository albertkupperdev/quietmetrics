import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import githubRouter from './routes/github';
import { requireAuth, AuthRequest } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/github', githubRouter);

app.get('/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ userId: req.userId });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
