import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getGitHubProfile, getGitHubRepos } from '../services/github.service';

const router = Router();

router.use(requireAuth);

router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getGitHubProfile(req.userId!);
    res.json(profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    res.status(400).json({ error: message });
  }
});

router.get('/repos', async (req: AuthRequest, res: Response) => {
  try {
    const repos = await getGitHubRepos(req.userId!);
    res.json(repos);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch repos';
    res.status(400).json({ error: message });
  }
});

export default router;
