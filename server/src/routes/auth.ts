import { Router, Request, Response } from 'express';
import { exchangeCodeForToken, upsertUser, createJwt } from '../services/auth.service';

const router = Router();

const isProd = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get('/github', (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID ?? '',
    scope: 'read:user repo',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get('/github/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    res.redirect(`${CLIENT_URL}?error=missing_code`);
    return;
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const user = await upsertUser(accessToken);
    const token = createJwt(user.id);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.redirect(`${CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect(`${CLIENT_URL}?error=oauth_failed`);
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default router;
