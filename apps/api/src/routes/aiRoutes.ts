import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { JobService } from '../services/jobService';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { aiEndpointLimiter } from '../middleware/rateLimiter';
import { ResumeModel } from '../models';

const router = Router();
router.use(aiEndpointLimiter);

// POST /api/v1/ai/resume-review - Optimize bullet point or generate summary
router.post('/resume-review', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { action, bullet, role, headline, skills, experienceYears } = req.body;
    const userId = req.auth?.userId;

    if (action === 'optimize-bullet') {
      if (!bullet) {
        return res.status(400).json({ success: false, error: 'Bullet text is required' });
      }
      const result = await AIService.optimizeBulletPoint(bullet, role, userId);
      return res.json({ success: true, result });
    }

    if (action === 'generate-summary') {
      const summary = await AIService.generateProfessionalSummary(
        headline || 'Software Engineer',
        skills || ['React', 'Node.js'],
        experienceYears || 3,
        userId
      );
      return res.json({ success: true, summary });
    }

    res.status(400).json({ success: false, error: 'Invalid review action' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/ai/job-match - Match resume against job
router.post('/job-match', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { jobId, resumeData, resumeId } = req.body;
    let finalResumeData = resumeData;

    if (!finalResumeData && resumeId) {
      const resDoc = await ResumeModel.findById(resumeId).lean();
      if (resDoc) finalResumeData = resDoc.data;
    }

    if (!finalResumeData) {
      return res.status(400).json({
        success: false,
        error: 'Resume data or resumeId is required for matching',
      });
    }

    let job = req.body.job;
    if (!job && jobId) {
      job = await JobService.getJobById(jobId);
    }

    if (!job) {
      return res.status(400).json({
        success: false,
        error: 'Job details or valid jobId required',
      });
    }

    const matchResult = await AIService.matchJobWithResume(
      finalResumeData,
      job,
      req.auth?.userId
    );

    res.json({ success: true, match: matchResult });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/ai/cover-letter - Tailor cover letter
router.post('/cover-letter', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { resumeData, job } = req.body;
    if (!resumeData || !job) {
      return res.status(400).json({
        success: false,
        error: 'Resume data and job information are required',
      });
    }

    const letter = await AIService.generateCoverLetter(
      resumeData,
      job,
      req.auth?.userId
    );

    res.json({ success: true, coverLetter: letter });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/ai/career-chat - Interactive AI career coach
router.post('/career-chat', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty' });
    }

    const reply = await AIService.careerChat(
      message.trim(),
      history,
      req.auth?.userId
    );

    res.json({ success: true, reply });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
