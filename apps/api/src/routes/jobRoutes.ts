import { Router, Request, Response } from 'express';
import { JobService } from '../services/jobService';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { validateQuery, validateBody } from '../middleware/validate';
import { JobQuerySchema, CreateJobSchema } from '@careerpulse/shared';
import { JobModel } from '../models';

const router = Router();

// GET /api/v1/jobs - Search jobs
router.get('/', validateQuery(JobQuerySchema), async (req: Request, res: Response) => {
  try {
    const result = await JobService.searchJobs(req.query as any);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/jobs/today - Today's published jobs
router.get('/today', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 15;
    const result = await JobService.getTodaysJobs(page, limit);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/jobs/recommended - Recommended jobs for candidate
router.get('/recommended', requireAuth, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const jobs = await JobService.getRecommendedJobs(req.auth!.userId, limit);
    res.json({ success: true, jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/jobs/saved - Saved jobs for candidate
router.get('/saved', requireAuth, async (req: Request, res: Response) => {
  try {
    const saved = await JobService.getSavedJobs(req.auth!.userId);
    res.json({ success: true, saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/jobs/:id/save - Save job
router.post('/:id/save', requireAuth, async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { notes } = req.body;
    await JobService.saveJob(req.auth!.userId, jobId, notes);
    res.json({ success: true, message: 'Job saved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/jobs/:id/save - Unsave job
router.delete('/:id/save', requireAuth, async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await JobService.unsaveJob(req.auth!.userId, jobId);
    res.json({ success: true, message: 'Job unsaved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/jobs/:id - Single job detail
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const jobId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const job = await JobService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/jobs - Post a new job (Recruiter)
router.post('/', requireAuth, validateBody(CreateJobSchema), async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const sourceJobId = `native_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const job = await JobModel.create({
      ...data,
      source: 'direct',
      sourceJobId,
      recruiterId: req.auth!.userId,
      isNative: true,
      publishedDate: new Date(),
      lastVerifiedDate: new Date(),
      sourceAttribution: 'CareerPulse Verified Employer',
    });

    res.status(201).json({
      success: true,
      job: {
        ...job.toObject(),
        id: job._id.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
