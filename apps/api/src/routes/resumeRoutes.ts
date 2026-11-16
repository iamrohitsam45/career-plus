import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { ResumeModel, ResumeVersionModel } from '../models';

const router = Router();

// GET /api/v1/resumes - List resumes for user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const resumes = await ResumeModel.find({ userId: req.auth!.userId })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      success: true,
      resumes: resumes.map((r: any) => ({
        ...r,
        id: r._id.toString(),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/resumes - Create new resume
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { title = 'My Resume', templateId = 'modern', data } = req.body;

    const initialData = data || {
      personalInfo: {
        fullName: req.auth!.email?.split('@')[0] || 'Software Professional',
        email: req.auth!.email || 'user@careerpulse.ai',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
        title: 'Full Stack Engineer',
        summary: 'Experienced Full Stack Engineer passionate about building scalable, high-performance web applications with clean architecture and modern frameworks.',
      },
      experience: [
        {
          id: 'exp_1',
          company: 'Tech Innovations Pvt Ltd',
          position: 'Senior Software Engineer',
          location: 'Bengaluru, India',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          highlights: [
            'Architected microservices that handled 5M+ daily requests with 99.98% uptime.',
            'Optimized Next.js frontend performance, reducing LCP by 42% across core landing pages.',
          ],
        },
      ],
      education: [
        {
          id: 'edu_1',
          institution: 'National Institute of Technology',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science & Engineering',
          startDate: '2017',
          endDate: '2021',
          grade: '8.8 CGPA',
        },
      ],
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS'],
      projects: [
        {
          id: 'proj_1',
          title: 'Real-time Analytics Dashboard',
          description: 'High-throughput stream analytics dashboard built with WebSockets and Tailwind CSS.',
          technologies: ['React', 'Node.js', 'Redis'],
        },
      ],
      certifications: ['AWS Certified Solutions Architect'],
      awards: ['Engineering Excellence Award 2023'],
    };

    const resume = await ResumeModel.create({
      userId: req.auth!.userId,
      title,
      templateId,
      data: initialData,
      atsScoreEstimate: 88,
      atsFeedback: [
        'Strong quantifiable metrics in work experience highlights',
        'Consider adding more cloud deployment keywords (CI/CD, Terraform)',
      ],
      version: 1,
    });

    res.status(201).json({
      success: true,
      resume: {
        ...resume.toObject(),
        id: resume._id.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/resumes/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const resume = await ResumeModel.findOne({
      _id: req.params.id,
      userId: req.auth!.userId,
    }).lean();

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    res.json({
      success: true,
      resume: {
        ...(resume as any),
        id: (resume as any)._id.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/resumes/:id
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const resume = await ResumeModel.findOne({
      _id: req.params.id,
      userId: req.auth!.userId,
    });

    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    // Save current version snapshot before mutating
    await ResumeVersionModel.create({
      resumeId: resume._id.toString(),
      version: resume.version,
      data: resume.data,
    });

    if (req.body.title) resume.title = req.body.title;
    if (req.body.templateId) resume.templateId = req.body.templateId;
    if (req.body.data) resume.data = req.body.data;
    if (req.body.atsScoreEstimate) resume.atsScoreEstimate = req.body.atsScoreEstimate;
    if (req.body.atsFeedback) resume.atsFeedback = req.body.atsFeedback;
    resume.version += 1;

    await resume.save();

    res.json({
      success: true,
      resume: {
        ...resume.toObject(),
        id: resume._id.toString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/v1/resumes/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await ResumeModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth!.userId,
    });

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
