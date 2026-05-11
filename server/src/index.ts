import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import authRouter from './routes/auth';
import githubRouter from './routes/github';
import { getGitHubProfile, getGitHubRepos, getActivityMetrics } from './services/github.service';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const allowedOrigin = process.env.CLIENT_URL ?? 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });
app.use('/auth', authRouter);
app.use('/github', githubRouter);

const io = new Server(server, {
  cors: { origin: allowedOrigin, credentials: true },
});

io.use((socket, next) => {
  const cookie = socket.handshake.headers.cookie ?? '';
  const token = cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

  if (!token) return next(new Error('Not authenticated'));

  const secret = process.env.JWT_SECRET;
  if (!secret) return next(new Error('Server misconfiguration'));

  try {
    const payload = jwt.verify(token, secret) as { userId: number };
    socket.data.userId = payload.userId;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId: number = socket.data.userId;

  async function pushStats() {
    try {
      const [profile, repos, activity] = await Promise.all([
        getGitHubProfile(userId),
        getGitHubRepos(userId),
        getActivityMetrics(userId),
      ]);
      socket.emit('stats:update', { profile, repos, activity });
    } catch {}
  }

  pushStats();
  const interval = setInterval(pushStats, 30_000);
  socket.on('disconnect', () => clearInterval(interval));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
